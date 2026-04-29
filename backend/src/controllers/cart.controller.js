/**
 * @typedef {import('../../types/controllers/cart.type.js').GetCartRequest} GetCartRequest
 * @typedef {import('../../types/controllers/cart.type.js').GetCartResponse} GetCartResponse
 * @typedef {import('../../types/controllers/cart.type.js').UpdateCartRequest} UpdateCartRequest
 * @typedef {import('../../types/controllers/cart.type.js').UpdateCartResponse} UpdateCartResponse
 * @typedef {import('../../types/controllers/cart.type.js').CheckoutCartRequest} CheckoutCartRequest
 * @typedef {import('../../types/controllers/cart.type.js').CheckoutCartResponse} CheckoutCartResponse
 * @typedef {import('../../types/controllers/cart.type.js').CheckoutCartHttpRequest} CheckoutCartHttpRequest
 */

import * as cartService from '../services/cart/cart.service.js';

function createHttpError(statusCode, message) {
	const error = /** @type {Error & { statusCode: number }} */ (
		new Error(message)
	);
	error.statusCode = statusCode;
	return error;
}

/**
 * GET /cart
 * Return current cart for authenticated user or guest session.
 *
 * @param {import('express').Request<{}, GetCartResponse, {}, GetCartRequest>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function get(req, res, next) {
	try {
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		if (!sessionId) {
			throw createHttpError(400, "Missing session_id");
		}
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
 * @param {import('express').Request<{}, UpdateCartResponse, UpdateCartRequest>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function update(req, res, next) {
	try {
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		if (!sessionId) {
			throw createHttpError(400, "Missing session_id");
		}

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
 * @param {CheckoutCartHttpRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function checkout(req, res, next) {
	try {
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		if (!sessionId) {
			throw createHttpError(400, "Missing session_id");
		}
		const userId = Number(req.user?.id);
		if (!Number.isInteger(userId)) {
			throw createHttpError(401, "Unauthorized");
		}
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
