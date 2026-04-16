import { select } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/order.type.js").Orders} Orders
 * @typedef {import("../../../../../types/db/order.type.js").OrderItems} OrderItems
 * @typedef {import("../../../../../types/db/order.type.js").CustomOrderItemIngredients} CustomOrderItemIngredients
 */

/**
 * ORDERS TABLE ONLY
 * @param {number} orderId
 * @returns {Promise<Orders|null>}
 */
export async function getOrderRow(orderId) {
  const rows = await select(
    `
    SELECT *
    FROM orders
    WHERE id = ?
    `,
    [orderId]
  );

  return /** @type {Orders | null} */ (rows[0] || null);
}

/**
 * ORDER ITEMS ONLY
 * @param {number} orderId
 * @returns {Promise<OrderItems[]>}
 */
export async function getOrderItems(orderId) {
  const rows = await select(
    `
    SELECT *
    FROM order_items
    WHERE order_id = ?
    `,
    [orderId]
  );

  return /** @type {OrderItems[]} */ (rows);
}

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
