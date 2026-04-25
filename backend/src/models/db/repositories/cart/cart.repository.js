import { select, execute } from '../../db.js';

/**
 * @typedef {import('../../../../../types/db/cart.type.js').Cart} Cart
 */

/**
 * CREATE CART BY USER ID
 * @param {number} userId
 * @returns {Promise<number>}
 */
export const createCartByUserId = async (userId) => {
	const result = await execute(
		`
    INSERT INTO cart
    (user_id, session_id)
    VALUES (?, ?)
    `,
		[userId, null]
	);

	return result.insertId;
}

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
 * GET CART BY USER ID
 * @param {number} userId
 * @returns {Promise<Cart|null>}
 */
export const getCartByUserId = async (userId) => {
	const rows = await select(
		`
    SELECT *
    FROM cart
    WHERE user_id = ?
    LIMIT 1
    `,
		[userId]
	);

	return /** @type {Cart|null} */ (rows[0] ?? null);
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
 * UPDATE CART BY USER ID
 * @param {number} userId
 * @returns {Promise<void>}
 */
export const updateCartByUserId = async (userId) => {
	await execute(
		`
    UPDATE cart
    SET updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
    `,
		[userId]
	);
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
