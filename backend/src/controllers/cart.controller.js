import * as cartService from '../services/cart/cart.service.js';

/**
 * GET /cart
 * Return current cart for authenticated user or guest session.
 *
 */
export async function get(req, res, next) {
	try {
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		const cart = await cartService.getCartBySessionId(sessionId);

		return res.json({ cart });
	} catch (err) {
		next(err);
	}
}

/**
 * PATCH /cart
 * Update cart for authenticated user or guest session.
 *
 */
export async function update(req, res, next) {
	try {
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		const { dish_id, quantity } = req.body || {};
		const cart = await cartService.updateCartDishBySessionId(sessionId, dish_id, quantity);

		return res.json({ cart });
	} catch (err) {
		next(err);
	}
}
