import { select, execute } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/order.type.js").OrderStatusHistory} OrderStatusHistory
 * @typedef {import("mysql2").ResultSetHeader} ResultSetHeader
 */

/**
 * Get full order status history
 * @param {number} orderId
 * @returns {Promise<OrderStatusHistory[]>}
 */
export async function getHistoryByOrderId(orderId) {
  const rows = await select(
    `
    SELECT *
    FROM order_status_history
    WHERE order_id = ?
    ORDER BY changed_at ASC
    `,
    [orderId]
  );

  return /** @type {OrderStatusHistory[]} */ (rows);
}

/**
 * Insert status change
 * @param {number} orderId
 * @param {number} statusId
 * @returns {Promise<ResultSetHeader>}
 */
export async function insertStatusChange(orderId, statusId) {
  return await execute(
    `
    INSERT INTO order_status_history (order_id, status_id, changed_at)
    VALUES (?, ?, NOW())
    `,
    [orderId, statusId]
  );
}
