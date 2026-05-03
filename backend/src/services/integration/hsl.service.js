/**
 * HSL Digitransit v2 routing integration.
 *
 * API: https://api.digitransit.fi/routing/v2/hsl/gtfs/v1
 * Docs: https://digitransit.fi/en/developers/apis/1-routing-api/
 *
 * Notes:
 * - Geometry is returned as encoded polyline - decoded via @mapbox/polyline
 *
 * No DB access. Pure external API service.
 */

import polyline from '@mapbox/polyline';
import dotenv from 'dotenv';
dotenv.config();

// ── Config ────────────────────────────────────────────────────────────────────

const HSL_BASE_URL = process.env.HSL_BASE_URL;

const TIMEOUT_MS  = 8000;
const MAX_RETRIES = 2;

const API_KEY = process.env.HSL_API_KEY || null;

// ── Mode mapping ──────────────────────────────────────────────────────────────

const MODE_MAP = {
  walk:    'WALK',
  bike:    'BICYCLE',
  transit: 'TRANSIT',
  bus:     'BUS',
  tram:    'TRAM',
  subway:  'SUBWAY',
  rail:    'RAIL',
  ferry:   'FERRY',
};

// ── GraphQL query ─────────────────────────────────────────────────────────────

function buildQuery(from, to, transportMode, numItineraries = 1) {
  return `{
    plan(
      from: { lat: ${from.lat}, lon: ${from.lon} }
      to:   { lat: ${to.lat},   lon: ${to.lon}   }
      transportModes: [{ mode: ${transportMode} }]
      numItineraries: ${numItineraries}
    ) {
      itineraries {
        duration
        legs {
          mode
          startTime
          endTime
          distance
          from { name lat lon }
          to   { name lat lon }
          route { shortName longName }
          legGeometry { points }
        }
      }
    }
  }`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizePlaceName(name, fallback) {
  if (!name) return fallback;
  if (name === 'Origin') return 'Start';
  if (name === 'Destination') return 'End';
  return name;
}

function decodeGeometry(leg) {
  const encoded = leg.legGeometry?.points;

  if (!encoded || typeof encoded !== 'string') return [];

  try {
    return polyline.decode(encoded); // [[lat, lon], ...]
  } catch {
    console.warn('[HSL] polyline decode failed for leg:', leg.mode);
    return [];
  }
}

function mapLeg(leg) {
  const durationMins = Math.round((leg.endTime - leg.startTime) / 60000);

  return {
    mode: leg.mode,

    durationMins: Math.max(0, durationMins),
    distanceM:    Math.round(leg.distance ?? 0),

    from: {
      name: normalizePlaceName(leg.from?.name, 'Start'),
      lat:  leg.from?.lat ?? 0,
      lon:  leg.from?.lon ?? 0,
    },

    to: {
      name: normalizePlaceName(leg.to?.name, 'End'),
      lat:  leg.to?.lat ?? 0,
      lon:  leg.to?.lon ?? 0,
    },

    route: leg.route
      ? {
          shortName: leg.route.shortName ?? '',
          longName:  leg.route.longName  ?? '',
        }
      : null,

    geometry: decodeGeometry(leg),
  };
}

// ── Request layer ─────────────────────────────────────────────────────────────

async function hslRequest(query, attempt = 1) {
  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['digitransit-subscription-key'] = API_KEY;
    }

    console.debug('[HSL] request attempt:', attempt);

    const res = await fetch(HSL_BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HSL API ${res.status}: ${res.statusText} — ${text}`);
    }

    const json = await res.json();

    if (json.errors?.length) {
      throw new Error(`HSL GraphQL: ${json.errors[0].message}`);
    }

    return json.data;

  } catch (err) {
    const retryable =
      err.name === 'AbortError' ||
      err.message.includes('fetch') ||
      err.message.includes('network');

    if (retryable && attempt <= MAX_RETRIES) {
      await new Promise(r => setTimeout(r, 500 * attempt));
      return hslRequest(query, attempt + 1);
    }

    throw err;

  } finally {
    clearTimeout(timeout);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getRoute({ from, to, mode }) {
  if (!from || !to) {
    throw new TypeError('getRoute: from and to coordinates are required');
  }

  const transportMode = MODE_MAP[mode];

  if (!transportMode) {
    throw new Error(
      `getRoute: unsupported mode "${mode}". Supported: ${Object.keys(MODE_MAP).join(', ')}`
    );
  }

  try {
    const data      = await hslRequest(buildQuery(from, to, transportMode));
    const itinerary = data?.plan?.itineraries?.[0];

    if (!itinerary) return null;

    const legs = (itinerary.legs ?? []).map(mapLeg);

    const distanceM = legs.reduce((sum, l) => sum + l.distanceM, 0);

    return {
      durationMins: Math.round(itinerary.duration / 60),
      distanceM,
      legs,
    };

  } catch (err) {
    console.error('[HSL] getRoute failed:', err.message);
    return null;
  }
}
