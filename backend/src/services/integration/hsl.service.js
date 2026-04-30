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
