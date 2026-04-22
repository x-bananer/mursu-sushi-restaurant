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
export const getCartItemIngredientRowsByCartItemId = async (cartItemId) => {
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
 * UPDATE CART ITEM INGREDIENT
 * @param {Object} cartItemIngredientData
 * @returns {Promise<void>}
 */
export const updateCartItemIngredient = async ({ id, ingredient_id, quantity, position }) => {
  await execute(
    `
    UPDATE cart_item_ingredient
    SET ingredient_id = ?, quantity = ?, position = ?
    WHERE id = ?
    `,
    [ingredient_id, quantity, position, id]
  );
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
