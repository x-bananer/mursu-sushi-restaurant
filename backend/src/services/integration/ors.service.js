/**
 * services/integrations/ors.service.js
 * ──────────────────────────────────────
 * OpenRouteService integration for car routing.
 * Used exclusively for delivery orders — HSL does not support car routing.
 *
 * API: https://api.openrouteservice.org/v2/directions/driving-car
 * Docs: https://openrouteservice.org/dev/#/api-docs
 * Free tier: 2 000 requests/day · 40 requests/minute
 *
 * Requires: ORS_API_KEY in environment variables.
 *
 * No DB access. No HTTP req/res. Pure external API calls.
 *
 */

import polyline from '@mapbox/polyline';
import dotenv from 'dotenv';
dotenv.config();

/**
 * services/integrations/ors.service.js
 * ──────────────────────────────────────
 * OpenRouteService car routing integration (production ready)
 */

const ORS_BASE_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';
const ORS_API_KEY  = process.env.ORS_API_KEY;
const TIMEOUT_MS   = 10_000;
const MAX_RETRIES  = 2;

// ── Geometry ─────────────────────────────────────────────

/**
 * Extract ORS geometry safely
 */
function extractGeometry(route) {
  const geom = route?.geometry;

  if (!geom) {
    console.warn('[ORS] No geometry');
    return [];
  }

  // Case 1: encoded polyline
  if (typeof geom === 'string') {
    try {
      return polyline.decode(geom); // → [[lat, lon], ...]
    } catch (err) {
      console.warn('[ORS] Failed to decode polyline');
      return [];
    }
  }

  // Case 2: GeoJSON
  if (Array.isArray(geom?.coordinates)) {
    return geom.coordinates.map(([lon, lat]) => [lat, lon]);
  }

  // Case 3: raw [[lon, lat]]
  if (Array.isArray(geom)) {
    return geom.map(([lon, lat]) => [lat, lon]);
  }

  console.warn('[ORS] Unknown geometry format');
  return [];
}
