import { select, execute } from '../../db.js';

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

/**
 * LIST ORDERS (RAW)
 * @returns {Promise<Orders[]>}
 */
export async function listOrders() {
  const rows = await select(`SELECT * FROM orders`);
  return /** @type {Orders[]} */ (rows);
}

/**
 * CREATE ORDER
 * @param {Object} data
 * @param {number} data.user_id
 * @param {number} data.delivery_type_id
 * @param {string} data.address
 * @param {number} data.total_price
 * @returns {Promise<number>}
 */
export async function createOrder(data) {
  const result = await execute(
    `
    INSERT INTO orders
    (user_id, status_id, delivery_type_id, is_paid, address, total_price)
    VALUES (?, 1, ?, 0, ?, ?)
    `,
    [data.user_id, data.delivery_type_id, data.address, data.total_price]
  );

  return result.insertId;
}

/**
 * UPDATE ORDER STATUS
 * @param {number} orderId
 * @param {number} statusId
 * @returns {Promise<void>}
 */
export async function updateOrderStatus(orderId, statusId) {
  await execute(
    `
    UPDATE orders
    SET status_id = ?, updated_at = NOW()
    WHERE id = ?
    `,
    [statusId, orderId]
  );
}
