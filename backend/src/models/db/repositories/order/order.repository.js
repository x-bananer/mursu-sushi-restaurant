import { select, execute } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/order.type.js").Orders} Orders
 */

/**
 * ORDERS TABLE WITH JOINS FOR STATUS AND DELIVERY TYPE
 * @param {number} orderId
 * @returns {Promise<Orders|null>}
 */
export async function getOrderRow(orderId) {
  const rows = await select(
    `
    SELECT
      orders.*,

      -- status
      order_status.id   AS status_id,
      order_status.type AS status_type,
      order_status.name AS status_name,

      -- delivery type
      delivery_type.id   AS delivery_type_id,
      delivery_type.type AS delivery_type_type,
      delivery_type.name AS delivery_type_name

    FROM orders
    JOIN order_status
      ON order_status.id = orders.status_id

    JOIN delivery_type
      ON delivery_type.id = orders.delivery_type_id

    WHERE orders.id = ?
    `,
    [orderId]
  );

  return /** @type {Orders | null} */ (rows[0] || null);
}

/**
 * LIST ORDERS WITH JOINS FOR STATUS AND DELIVERY TYPE
 * @returns {Promise<Orders[]>}
 */
export async function listOrders() {
  const rows = await select(
    `
    SELECT
      orders.*,

      -- status
      order_status.id   AS status_id,
      order_status.type AS status_type,
      order_status.name AS status_name,

      -- delivery type
      delivery_type.id   AS delivery_type_id,
      delivery_type.type AS delivery_type_type,
      delivery_type.name AS delivery_type_name

    FROM orders
    JOIN order_status
      ON order_status.id = orders.status_id

    JOIN delivery_type
      ON delivery_type.id = orders.delivery_type_id

    ORDER BY orders.id ASC
    `
  );

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
