/**
 * order.checkout.js
 * ─────────────────────────────────────────────
 * Orchestrates ETA + routing for:
 *  - DELIVERY (ORS car)
 *  - PICKUP (HSL transit/walk)
 *  - DINE_IN (same as pickup)
 */

import { KitchenEngine } from '../../models/engine/kitchen.engine.js';
import { getRoute as getHslRoute } from '../integration/hsl.service.js';
import { getCarRoute } from '../integration/ors.service.js';
import { distanceMetres, recommendedMode } from '../../utils/haversine.js';

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
function createHttpError(statusCode, message) {
  const error = /** @type {Error & { statusCode: number }} */ (new Error(message));
  error.statusCode = statusCode;
  return error;
}

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
export const SERVICE_TYPE = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
  DINE_IN: 'dine_in',
};

const DELIVERY_BUFFER_MIN = 5;
const ARRIVAL_BUFFER_MIN = 2;

// ─────────────────────────────────────────────
// RESTAURANT COORDS
// ─────────────────────────────────────────────

function getRestaurantCoords() {
  const lat = Number(process.env.RESTAURANT_LAT);
  const lon = Number(process.env.RESTAURANT_LON);

  if (!lat || !lon || Number.isNaN(lat) || Number.isNaN(lon)) {
	throw createHttpError(400, 'Missing RESTAURANT_LAT / RESTAURANT_LON');
  }
  return { lat, lon };
}

// ─────────────────────────────────────────────
// FALLBACKS
// ─────────────────────────────────────────────

function fallbackWalkTime(from, to) {
  const km = distanceMetres(from, to) / 1000;
  return Math.round((km / 5) * 60);
}

function fallbackTransitTime(from, to) {
  const km = distanceMetres(from, to) / 1000;
  return Math.round((km / 20) * 60);
}

function fallbackCarTime(from, to) {
  const km = distanceMetres(from, to) / 1000;
  return Math.round((km / 30) * 60);
}

// ─────────────────────────────────────────────
// BASE (kitchen truth source)
// ─────────────────────────────────────────────

function buildBase(order, activeOrdersAheadCount, restaurantCoords) {
  const kitchen = KitchenEngine.estimateReadyTime(order, {
    activeOrdersAheadCount,
  });

  return {
    prepTime: kitchen.prepTime,
    queueDelay: kitchen.queueDelay,
    readyAt: kitchen.readyAt,
    queuePosition: kitchen.queuePosition,
    restaurantCoords,
  };
}

// ─────────────────────────────────────────────
// DELIVERY (ORS CAR)
// ─────────────────────────────────────────────

async function buildDelivery(base, userCoords, restaurantCoords) {
  if (!userCoords) return { ...base, travel: null, deliveredAt: null };

  const route = await getCarRoute({
    from: restaurantCoords,
    to: userCoords,
  });

  const travelMins =
    route?.durationMins ??
    fallbackCarTime(restaurantCoords, userCoords);

  const deliveredAt = new Date(
    base.readyAt.getTime() + (travelMins + DELIVERY_BUFFER_MIN) * 60000
  );

  return {
    ...base,
    travel: {
      mode: 'car',
      durationMins: travelMins,
      distanceM: route?.distanceM ?? null,
      geometry: route?.geometry ?? [],
      steps: route?.steps ?? [],
      legs: [],
    },
    deliveredAt,
  };
}

// ─────────────────────────────────────────────
// PICKUP (HSL)
// ─────────────────────────────────────────────

async function buildPickup(base, userCoords, restaurantCoords) {
  if (!userCoords) return { ...base, travel: null, leaveAt: null };

  const mode = recommendedMode(userCoords, restaurantCoords);

  const route = await getHslRoute({
    from: userCoords,
    to: restaurantCoords,
    mode,
  });

  const travelMins =
    route?.durationMins ??
    (mode === 'walk'
      ? fallbackWalkTime(userCoords, restaurantCoords)
      : fallbackTransitTime(userCoords, restaurantCoords));

  const leaveAt = new Date(
    base.readyAt.getTime() - (travelMins + ARRIVAL_BUFFER_MIN) * 60000
  );

  return {
    ...base,
    recommendedMode: mode,
    travel: {
      mode,
      durationMins: travelMins,
      distanceM: route?.distanceM ?? null,
      geometry:
        route?.legs?.flatMap(l => l.geometry ?? []) ?? [],

      legs: route?.legs ?? [],
      steps: [],
    },
    leaveAt,
  };
}

// ─────────────────────────────────────────────
// DINE IN
// ─────────────────────────────────────────────

async function buildDineIn(base, userCoords, restaurantCoords) {
  return buildPickup(base, userCoords, restaurantCoords);
}

// ─────────────────────────────────────────────
// MAIN ENTRY FOR GETTING A RECOMMENDED MODE
// ─────────────────────────────────────────────

export async function orderEstimates(order, options = {}) {
  const {
    userCoords = null,
    serviceType,
    activeOrdersAheadCount = 0,
  } = options;

  const restaurantCoords = getRestaurantCoords();
  const base = buildBase(order, activeOrdersAheadCount, restaurantCoords);

  switch (serviceType) {
    case SERVICE_TYPE.DELIVERY:
      return buildDelivery(base, userCoords, restaurantCoords);

    case SERVICE_TYPE.PICKUP:
      return buildPickup(base, userCoords, restaurantCoords);

    case SERVICE_TYPE.DINE_IN:
      return buildDineIn(base, userCoords, restaurantCoords);

    default:
	  throw createHttpError(400, `Invalid serviceType: ${serviceType}`);
  }
}

// ─────────────────────────────────────────────
// MAIN ENTRY FOR SWITCHING MODES
// ─────────────────────────────────────────────
export async function getRouteForMode({
  order,
  userCoords,
  mode,
}) {
  const restaurantCoords = getRestaurantCoords();

  if (!userCoords) {
	throw createHttpError(400, 'User coordinates required');
  }

  // DELIVERY restriction
  if (order.delivery_type.type === SERVICE_TYPE.DELIVERY && mode !== 'car') {
	throw createHttpError(400, 'Only car mode allowed for delivery');
  }

  // ── CAR (ORS) ───────────────────────────
  if (mode === 'car') {
    const route = await getCarRoute({
      from: restaurantCoords,
      to: userCoords,
    });

    const duration =
      route?.durationMins ??
      fallbackCarTime(restaurantCoords, userCoords);

    return {
      mode: 'car',
      durationMins: duration,
      distanceM: route?.distanceM ?? null,
      geometry: route?.geometry ?? [],
      steps: route?.steps ?? [],
      legs: [],
    };
  }

  // ── HSL MODES ───────────────────────────
  const route = await getHslRoute({
    from: userCoords,
    to: restaurantCoords,
    mode,
  });

  const duration =
    route?.durationMins ??
    (mode === 'walk'
      ? fallbackWalkTime(userCoords, restaurantCoords)
      : fallbackTransitTime(userCoords, restaurantCoords));

  return {
    mode,
    durationMins: duration,
    distanceM: route?.distanceM ?? null,
    geometry: route?.legs?.flatMap(l => l.geometry ?? []) ?? [],
    legs: route?.legs ?? [],
    steps: [],
  };
}
