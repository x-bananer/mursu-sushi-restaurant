import { select } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/order.type.js").OrderItems} OrderItems
 */

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
 * LIST ITEMS (RAW)
 * @returns {Promise<OrderItems[]>}
 */
export async function listItemsByOrderIds(orderIds) {
  if (!orderIds.length) return [];

  const placeholders = orderIds.map(() => '?').join(',');

  const rows = await select(
    `
    SELECT *
    FROM order_items
    WHERE order_id IN (${placeholders})
    `,
    orderIds
  );

  return /** @type {OrderItems[]} */ (rows);
}
