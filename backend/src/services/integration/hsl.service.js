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

const HSL_ENDPOINT = 'https://api.digitransit.fi/routing/v2/hsl/gtfs/v1';

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
