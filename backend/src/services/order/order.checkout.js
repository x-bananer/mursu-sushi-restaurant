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
// TYPES
// ─────────────────────────────────────────────

export const SERVICE_TYPE = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
  DINE_IN: 'dine_in',
};

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const DELIVERY_BUFFER_MIN = 5;
const ARRIVAL_BUFFER_MIN = 2;

// ─────────────────────────────────────────────
// RESTAURANT COORDS
// ─────────────────────────────────────────────

function getRestaurantCoords() {
  const lat = Number(process.env.RESTAURANT_LAT);
  const lon = Number(process.env.RESTAURANT_LON);

  if (!lat || !lon || Number.isNaN(lat) || Number.isNaN(lon)) {
    throw new Error('Missing RESTAURANT_LAT / RESTAURANT_LON');
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
