import { select, execute } from '../../db.js';

/**
 * @typedef {import('../../../../../types/db/cart.type.js').Cart} Cart
 */

/**
 * CREATE CART BY SESSION ID
 * @param {string} sessionId
 * @returns {Promise<number>}
 */
export const createCartBySessionId = async (sessionId) => {
	const result = await execute(
		`
    INSERT INTO cart
    (user_id, session_id)
    VALUES (?, ?)
    `,
		[null, sessionId]
	);

	return result.insertId;
}

/**
 * GET CART BY SESSION ID
 * @param {string} sessionId
 * @returns {Promise<Cart|null>}
 */
export const getCartBySessionId = async (sessionId) => {
	const rows = await select(
		`
    SELECT *
    FROM cart
    WHERE session_id = ?
    LIMIT 1
    `,
		[sessionId]
	);

	return /** @type {Cart|null} */ (rows[0] ?? null);
}

/**
 * UPDATE CART BY SESSION ID
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
export const updateCartBySessionId = async (sessionId) => {
	await execute(
		`
    UPDATE cart
    SET updated_at = CURRENT_TIMESTAMP
    WHERE session_id = ?
    `,
		[sessionId]
	);
}

/**
 * ATTACH USER ID TO CART BY SESSION ID
 * @param {string} sessionId
 * @param {number} userId
 * @returns {Promise<void>}
 */
export const addUserIdToCart = async (sessionId, userId) => {
	await execute(
		`
    UPDATE cart
    SET user_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE session_id = ?
    `,
		[userId, sessionId]
	);
}

/**
 * UPDATE CART SESSION ID BY USER ID
 * @param {number} userId
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
export const updateCartSessionIdByUserId = async (userId, sessionId) => {
	await execute(
		`
    UPDATE cart
    SET session_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
    `,
		[sessionId, userId]
	);
}

/**
 * DELETE CART BY ID
 * @param {number} cartId
 * @returns {Promise<void>}
 */
export const deleteCartById = async (cartId) => {
	await execute(
		`
    DELETE FROM cart
    WHERE id = ?
    `,
		[cartId]
	);
}
