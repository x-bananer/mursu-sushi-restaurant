import { select, execute } from '../../db.js';

/**
 * @typedef {import('../../../../../types/db/cart.type.js').CartItem} CartItem
 */

/**
 * CREATE CART ITEM
 * @param {Object} cartItemData
 * @returns {Promise<number>}
 */
export const createCartItem = async ({ cart_id, dish_id, quantity, price, item_type_id }) => {
	const result = await execute(
		`
    INSERT INTO cart_item
    (cart_id, dish_id, quantity, price, item_type_id)
    VALUES (?, ?, ?, ?, ?)
    `,
		[cart_id, dish_id, quantity, price, item_type_id]
	);

	return result.insertId;
};

/**
 * GET CART ITEMS BY CART ID
 * @param {number} cartId
 * @returns {Promise<CartItem[]>}
 */
export const getCartItemsByCartId = async (cartId) => {
	const rows = await select(
		`
    SELECT
      cart_item.*,
      order_item_type.type AS item_type_type,
      order_item_type.name AS item_type_name,
      dishes.name AS dish_name,
      dishes.description AS dish_description,
      dishes.price AS dish_price,
      dishes.is_available AS dish_is_available,
      dishes.created_at AS dish_created_at
    FROM cart_item
    LEFT JOIN order_item_type
      ON order_item_type.id = cart_item.item_type_id
    LEFT JOIN dishes
      ON dishes.id = cart_item.dish_id
    WHERE cart_id = ?
    ORDER BY id ASC
    `,
		[cartId]
	);

	return /** @type {CartItem[]} */ (rows);
};

/**
 * GET DISH BY ID
 * @param {number} dishId
 * @returns {Promise<any|null>}
 */
export const getDishById = async (dishId) => {
	const rows = await select(
		`
    SELECT *
    FROM dishes
    WHERE id = ?
    LIMIT 1
    `,
		[dishId]
	);

	return rows[0] ?? null;
};

/**
 * UPDATE CART ITEM
 * @param {Object} cartItemData
 * @returns {Promise<void>}
 */
export const updateCartItem = async ({ id, dish_id, quantity, price, item_type_id }) => {
	await execute(
		`
    UPDATE cart_item
    SET dish_id = ?, quantity = ?, price = ?, item_type_id = ?
    WHERE id = ?
    `,
		[dish_id, quantity, price, item_type_id, id]
	);
};

/**
 * DELETE CART ITEM
 * @param {number} cartItemId
 * @returns {Promise<void>}
 */
export const deleteCartItem = async (cartItemId) => {
	await execute(
		`
    DELETE FROM cart_item
    WHERE id = ?
    `,
		[cartItemId]
	);
};

/**
 * DELETE CART ITEMS BY CART ID
 * @param {number} cartId
 * @returns {Promise<void>}
 */
export const deleteCartItemsByCartId = async (cartId) => {
	await execute(
		`
    DELETE FROM cart_item
    WHERE cart_id = ?
    `,
		[cartId]
	);
};
