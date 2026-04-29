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

		const { items } = req.body;
		const cart = await cartService.updateCartBySessionId(sessionId, items);

		return res.json({ cart });
	} catch (err) {
		next(err);
	}
}

/**
 * POST /cart/checkout
 *
 */
export async function checkout(req, res, next) {
	try {
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		const userId = Number(req.user?.id);
		const { delivery_type_id, address } = req.body;

		const order = await cartService.checkoutCartBySessionId(sessionId, userId, {
			delivery_type_id,
			address,
		});

		return res.json({ order });
	} catch (err) {
		next(err);
	}
}
