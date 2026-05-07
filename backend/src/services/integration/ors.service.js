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
import { t } from '../../i18n/messages.js';
dotenv.config();

/**
 * services/integrations/ors.service.js
 * ──────────────────────────────────────
 * OpenRouteService car routing integration (production ready)
 */

const ORS_BASE_URL = process.env.ORS_BASE_URL;
const ORS_API_KEY = process.env.ORS_API_KEY;
const TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;

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
		} catch {
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

// ── Steps ────────────────────────────────────────────────

function mapStep(step) {
	return {
		instruction: step.instruction ?? '',
		durationSecs: Math.round(step.duration ?? 0),
		distanceM: Math.round(step.distance ?? 0),
	};
}

// ── HTTP ─────────────────────────────────────────────────

async function orsRequest(body, attempt = 1, locale = 'en') {
	if (!ORS_API_KEY) {
		throw new Error(t(locale, 'integration', 'ors_api_key_missing'));
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

	try {
		const res = await fetch(ORS_BASE_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: ORS_API_KEY,
			},
			body: JSON.stringify(body),
			signal: controller.signal,
		});

		if (res.status === 429 && attempt <= MAX_RETRIES) {
			await new Promise((r) => setTimeout(r, 1000 * attempt));
			return orsRequest(body, attempt + 1, locale);
		}

		if (!res.ok) {
			throw new Error(t(locale, 'integration', 'ors_api_error'));
		}

		return res.json();
	} catch (err) {
		const retryable = err.name === 'AbortError' || err.message.includes('fetch');

		if (retryable && attempt <= MAX_RETRIES) {
			await new Promise((r) => setTimeout(r, 500 * attempt));
			return orsRequest(body, attempt + 1, locale);
		}

		throw err;
	} finally {
		clearTimeout(timeout);
	}
}

// ── Public API ───────────────────────────────────────────

export async function getCarRoute({ from, to, locale = 'en' }) {
	if (!from || !to) {
		throw new TypeError(t(locale, 'integration', 'ors_route_coords_required'));
	}

	if (
		typeof from.lat !== 'number' ||
		typeof from.lon !== 'number' ||
		typeof to.lat !== 'number' ||
		typeof to.lon !== 'number'
	) {
		throw new TypeError(t(locale, 'integration', 'ors_invalid_coordinate_format'));
	}

	try {
		const data = await orsRequest(
			{
				coordinates: [
					[from.lon, from.lat],
					[to.lon, to.lat],
				],
				instructions: true,
				geometry: true,
				geometry_simplify: false,
				language: 'en',
			},
			1,
			locale
		);

		const route = data?.routes?.[0];
		if (!route) return null;
		//console.log('[ORS RAW ROUTE]');
		//console.dir(route, { depth: null });

		const summary = route.summary;
		const steps = route.segments?.flatMap((s) => s.steps ?? []) ?? [];

		return {
			durationMins: Math.round(summary.duration / 60),
			distanceM: Math.round(summary.distance),
			geometry: extractGeometry(route),
			steps: steps.map(mapStep),
		};
	} catch (err) {
		console.error('[ORS] getCarRoute failed:', err.message);
		return null;
	}
}
