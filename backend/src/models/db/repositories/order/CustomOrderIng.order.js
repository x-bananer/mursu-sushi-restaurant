import { select } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/order.type.js").CustomOrderItemIngredients} CustomOrderItemIngredients
 */

/**
 * ORDER INGREDIENTS ONLY
 * @param {number} orderId
 * @returns {Promise<CustomOrderItemIngredients[]>}
 */
export async function getOrderIngredients(orderId) {
  const rows = await select(
    `
    SELECT *
    FROM custom_order_item_ingredients
    WHERE order_item_id IN (
      SELECT id FROM order_items WHERE order_id = ?
    )
    `,
    [orderId]
  );

  return /** @type {CustomOrderItemIngredients[]} */ (rows);
}

/**
 * LIST INGREDIENTS BY ORDER IDS
 * @param {number[]} orderIds
 * @returns {Promise<CustomOrderItemIngredients[]>}
 */
export async function listIngredientsByOrderIds(orderIds) {
  if (!orderIds.length) return [];

  const placeholders = orderIds.map(() => '?').join(',');

  const rows = await select(
    `
    SELECT *
    FROM custom_order_item_ingredients
    WHERE order_item_id IN (
      SELECT id FROM order_items WHERE order_id IN (${placeholders})
    )
    `,
    orderIds
  );

  return /** @type {CustomOrderItemIngredients[]} */ (rows);
}
