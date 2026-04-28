/**
 * @typedef {import('../../types/controllers/cart.type.js').GetCartRequest} GetCartRequest
 * @typedef {import('../../types/controllers/cart.type.js').GetCartResponse} GetCartResponse
 * @typedef {import('../../types/controllers/cart.type.js').UpdateCartRequest} UpdateCartRequest
 * @typedef {import('../../types/controllers/cart.type.js').UpdateCartResponse} UpdateCartResponse
 * @typedef {import('../../types/controllers/cart.type.js').CheckoutCartRequest} CheckoutCartRequest
 * @typedef {import('../../types/controllers/cart.type.js').CheckoutCartResponse} CheckoutCartResponse
 */

import * as cartService from '../services/cart/cart.service.js';

/**
 * GET /cart
 * Return current cart for authenticated user or guest session.
 *
 * @param {import('express').Request<{}, GetCartResponse, {}, GetCartRequest>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const get = async (req, res, next) => {
    try {
        // TODO: get user is from request when auth is ready
        const userId = 2;
        const cart = await cartService.getCartByUserId(userId);

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
export const update = async (req, res, next) => {
    try {
        // TODO: get userId from request when auth is ready
        const userId = 2;

        const { items } = req.body;
        const cart = await cartService.updateCartByUserId(userId, items);

        return res.json({ cart });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /cart/checkout
 *
 * @param {import('express').Request<{}, CheckoutCartResponse, CheckoutCartRequest>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const checkout = async (req, res, next) => {
    try {
        // TODO: get userId from request when auth is ready
        const userId = 2;
        const { delivery_type_id, address } = req.body;

        const order = await cartService.checkoutCartByUserId(userId, {
            delivery_type_id,
            address,
        });

        return res.json({ order });
    } catch (err) {
        next(err);
    }
}
