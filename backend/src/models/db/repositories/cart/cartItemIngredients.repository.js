import { select, execute } from '../../db.js';

/**
 * @typedef {import('../../../../../types/db/cart.type.js').CartItemIngredient} CartItemIngredient
 */

/**
 * CREATE CART ITEM INGREDIENT
 * @param {Object} cartItemIngredientData
 * @returns {Promise<number>}
 */
export const createCartItemIngredient = async ({ cart_item_id, ingredient_id, quantity, position }) => {
	const result = await execute(
		`
    INSERT INTO cart_item_ingredient
    (cart_item_id, ingredient_id, quantity, position)
    VALUES (?, ?, ?, ?)
    `,
		[cart_item_id, ingredient_id, quantity, position]
	);

	return result.insertId;
}

/**
 * GET CART ITEM INGREDIENTS BY CART ITEM ID
 * @param {number} cartItemId
 * @returns {Promise<CartItemIngredient[]>}
 */
export const getCartItemIngredientsByCartItemId = async (cartItemId) => {
	const rows = await select(
		`
    SELECT
      cart_item_ingredient.*,
      ingredients.name AS ingredient_name,
      ingredients.price AS ingredient_price
    FROM cart_item_ingredient
    LEFT JOIN ingredients
      ON ingredients.id = cart_item_ingredient.ingredient_id
    WHERE cart_item_id = ?
    ORDER BY position ASC
    `,
		[cartItemId]
	);

	return /** @type {CartItemIngredient[]} */ (rows);
}

/**
 * GET CART ITEM INGREDIENTS BY CART ITEM IDS
 * @param {number[]} cartItemIds
 * @returns {Promise<CartItemIngredient[]>}
 */
export const getCartItemIngredientsByCartItemIds = async (cartItemIds) => {
	if (!cartItemIds.length) {
		return [];
	}

	const placeholders = cartItemIds.map(() => '?').join(', ');

	const rows = await select(
		`
    SELECT
      cart_item_ingredient.*,
      ingredients.name AS ingredient_name,
      ingredients.price AS ingredient_price
    FROM cart_item_ingredient
    LEFT JOIN ingredients
      ON ingredients.id = cart_item_ingredient.ingredient_id
    WHERE cart_item_id IN (${placeholders})
    ORDER BY position ASC
    `,
		cartItemIds
	);

	return /** @type {CartItemIngredient[]} */ (rows);
}

/**
 * GET INGREDIENTS BY IDS
 * @param {number[]} ingredientIds
 * @returns {Promise<any[]>}
 */
export const getIngredientsByIds = async (ingredientIds) => {
	if (!ingredientIds.length) {
		return [];
	}

	const placeholders = ingredientIds.map(() => '?').join(', ');

	const rows = await select(
		`
    SELECT *
    FROM ingredients
    WHERE id IN (${placeholders})
    `,
		ingredientIds
	);

	return rows;
}

/**
 * DELETE CART ITEM INGREDIENT
 * @param {number} cartItemIngredientId
 * @returns {Promise<void>}
 */
export const deleteCartItemIngredient = async (cartItemIngredientId) => {
	await execute(
		`
    DELETE FROM cart_item_ingredient
    WHERE id = ?
    `,
		[cartItemIngredientId]
	);
}
