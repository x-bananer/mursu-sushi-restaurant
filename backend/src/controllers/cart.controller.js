/**
 * @typedef {import('../../types/controllers/cart.type.js').GetCartRequest} GetCartRequest
 * @typedef {import('../../types/controllers/cart.type.js').GetCartResponse} GetCartResponse
 * @typedef {import('../../types/controllers/cart.type.js').UpdateCartRequest} UpdateCartRequest
 * @typedef {import('../../types/controllers/cart.type.js').UpdateCartResponse} UpdateCartResponse
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
