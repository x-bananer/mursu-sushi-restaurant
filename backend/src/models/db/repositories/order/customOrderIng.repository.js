import { select } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/order.type.js").CustomOrderItemIngredients} CustomOrderItemIngredients
 */

/**
 * ORDER INGREDIENTS WITH ORDER ITEM FILTER
 * @param {number} orderId
 * @returns {Promise<CustomOrderItemIngredients[]>}
 */
export async function getOrderIngredients(orderId) {
  const rows = await select(
    `
    SELECT
      custom_order_item_ingredients.id,
      custom_order_item_ingredients.order_item_id,
      custom_order_item_ingredients.quantity,
      custom_order_item_ingredients.position,

      ingredients.id    AS ingredient_id,
      ingredients.name  AS ingredient_name,
      ingredients.price AS ingredient_price

    FROM custom_order_item_ingredients

    JOIN order_items
      ON order_items.id = custom_order_item_ingredients.order_item_id

    JOIN ingredients
      ON ingredients.id = custom_order_item_ingredients.ingredient_id

    WHERE order_items.order_id = ?
    `,
    [orderId]
  );

  return /** @type {CustomOrderItemIngredients[]} */ (rows);
}

export async function listIngredientsByOrderIds(orderIds) {
  if (!orderIds.length) return [];

  const placeholders = orderIds.map(() => '?').join(',');

  const rows = await select(
    `
    SELECT
      custom_order_item_ingredients.id,
      custom_order_item_ingredients.order_item_id,
      custom_order_item_ingredients.quantity,
      custom_order_item_ingredients.position,

      ingredients.id    AS ingredient_id,
      ingredients.name  AS ingredient_name,
      ingredients.price AS ingredient_price

    FROM custom_order_item_ingredients

    JOIN order_items
      ON order_items.id = custom_order_item_ingredients.order_item_id

    JOIN ingredients
      ON ingredients.id = custom_order_item_ingredients.ingredient_id

    WHERE order_items.order_id IN (${placeholders})
    `,
    orderIds
  );

  return /** @type {CustomOrderItemIngredients[]} */ (rows);
}
