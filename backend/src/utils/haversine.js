/**
 * Great-circle distance calculation using the Haversine formula.
 *
 * Haversine gives the shortest distance between two points on the
 * surface of a sphere. Accurate for short to medium distances
 * (up to a few hundred kilometres) — perfectly suited for city-level
 * routing decisions like "should this user walk or take transit?"
 *
 * No external dependencies. No side effects. Pure math.
 */

/** Earth's mean radius in metres (WGS-84 approximation). */
const EARTH_RADIUS_M = 6_371_000;

// ── Core formula ──────────────────────────────────────────────────────────────

function toRad(deg) {
	return (deg * Math.PI) / 180;
}

/**
 * Calculate the great-circle distance between two coordinates in metres.
 *
 * distanceMetres(
 *   { lat: 60.1699, lon: 24.9384 },  // Helsinki city centre
 *   { lat: 60.2052, lon: 24.6559 }   // Helsinki-Vantaa airport
 * ); // - ~22 400 metres
 */
export function distanceMetres(a, b) {
	if (
		typeof a?.lat !== 'number' ||
		typeof a?.lon !== 'number' ||
		typeof b?.lat !== 'number' ||
		typeof b?.lon !== 'number'
	) {
		throw new TypeError('distanceMetres: both arguments must be { lat: number, lon: number }');
	}

	const dLat = toRad(b.lat - a.lat);
	const dLon = toRad(b.lon - a.lon);

	const sinDLat = Math.sin(dLat / 2);
	const sinDLon = Math.sin(dLon / 2);

	const h =
		sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLon * sinDLon;

	return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/**
 * Calculate the great-circle distance between two coordinates in kilometres.
 *
 * distanceKm(
 *   { lat: 60.1699, lon: 24.9384 },
 *   { lat: 60.1712, lon: 24.9401 }
 * ); // - ~0.19 km
 */
export function distanceKm(a, b) {
	return Math.round((distanceMetres(a, b) / 1000) * 100) / 100;
}

/**
 * Determine the recommended travel mode based on walking distance threshold.
 *
 * Thresholds (empirically chosen for Helsinki):
 *   < 600 m   - walk    (about 7 minutes)
 *   600–1 200 m - walk  (borderline — still comfortable)
 *   > 1 200 m - transit (HSL tram/bus makes more sense)
 */
export function recommendedMode(from, to, walkThresholdM = 1200) {
	return distanceMetres(from, to) <= walkThresholdM ? 'walk' : 'transit';
}
