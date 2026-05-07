import app from './app.js';
import { startHeartbeat } from './services/order/order.tracker.js';
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);

	// ─────────────────────────────────────────────────────────────
	// SSE / REAL-TIME SYSTEM INITIALIZATION
	// ─────────────────────────────────────────────────────────────
	/**
	 * PURPOSE:
	 * Keeps SSE (Server-Sent Events) connections alive.
	 *
	 * WHY:
	 * - Prevents proxies/load balancers from closing idle connections
	 * - Ensures real-time order updates remain stable
	 * - Sends periodic "ping" comments to clients
	 *
	 * NOTE:
	 * This does NOT send data to the frontend,
	 * it only keeps the connection open.
	 */
	startHeartbeat();
});
