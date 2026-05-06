import * as cartService from '../services/cart/cart.service.js';

/**
 * @api {get} /api/v1/cart Get cart
 * @apiName GetCart
 * @apiGroup Cart
 * @apiHeader {String} x-session-id Session id.
 * @apiSuccess {Object} cart Cart DTO or null.
 * @apiError (400) BadRequest Missing session id.
 */
export async function get(req, res, next) {
	try {
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		const cart = await cartService.getCartBySessionId(sessionId, req.locale);

		return res.json({ cart });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {patch} /api/v1/cart Update cart
 * @apiName UpdateCart
 * @apiGroup Cart
 * @apiHeader {String} x-session-id Session id.
 * @apiBody {Number} [dish_id] Dish id for single-item update.
 * @apiBody {Number} [quantity] Quantity for single-item update.
 * @apiBody {Object[]} [items] Full items payload.
 * @apiSuccess {Object} cart Updated cart DTO.
 * @apiError (400) BadRequest Invalid payload or missing session id.
 */
export async function update(req, res, next) {
	try {
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		const { dish_id, quantity, items } = req.body || {};
		let cart = null;

		if (Array.isArray(items)) {
			cart = await cartService.updateCartBySessionId(sessionId, items, req.locale);
		} else {
			cart = await cartService.updateCartDishBySessionId(sessionId, dish_id, quantity, req.locale);
		}

		return res.json({ cart });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {get} /api/v1/cart/delivery-types Get delivery types
 * @apiName GetDeliveryTypes
 * @apiGroup Cart
 * @apiSuccess {Object[]} deliveryTypes Delivery type list.
 */
export async function getDeliveryTypes(req, res, next) {
	try {
		const deliveryTypes = await cartService.getDeliveryTypes();
		return res.json({ deliveryTypes });
	} catch (err) {
		next(err);
	}
}
