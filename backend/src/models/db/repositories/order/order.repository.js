import { select, execute } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/order.type.js").Orders} Orders
 */

/**
 * Base JOIN block for status and delivery type
 */
const ORDER_BASE = `
  FROM orders

  JOIN order_status
    ON order_status.id = orders.status_id

  JOIN delivery_type
    ON delivery_type.id = orders.delivery_type_id
`;

/**
 * Standard select (full order view)
 */
const ORDER_SELECT = `
  SELECT
    orders.*,

    order_status.type AS status_type,
    order_status.name AS status_name,

    delivery_type.type AS delivery_type_type,
    delivery_type.name AS delivery_type_name
`;

/**
 * CORE
 */

/**
 * Get single order by ID
 * @typedef {Orders & {
 *   status_type: string,
 *   status_name: string,
 *   delivery_type_type: string,
 *   delivery_type_name: string
 * }} OrderRow
 * @param {number} orderId
 * @returns {Promise<OrderRow|null>}
 */
export async function getOrderById(orderId) {
	const rows = await select(
		`
    ${ORDER_SELECT}
    ${ORDER_BASE}
    WHERE orders.id = ?
    `,
		[orderId]
	);

	return /** @type {OrderRow | null} */ (rows[0] || null);
}

/**
 * Get active orders (dashboard)
 * pending, confirmed, preparing, ready
 *
 * @returns {Promise<Orders[]>}
 */

export async function getActiveOrders() {
	const rows = await select(
		`
    ${ORDER_SELECT}
    ${ORDER_BASE}
    WHERE order_status.type IN ('pending', 'confirmed', 'preparing', 'ready')
    ORDER BY orders.created_at ASC
    `
	);

	return /** @type {Orders[] | null} */ (rows);
}

/**
 * ADMIN / KITCHEN
 */

/**
 * Create order (called by cart after payment)
 * @param {Object} data
 * @param {number} data.user_id
 * @param {number} data.delivery_type_id
 * @param {string} data.address
 * @param {number} data.total_price
 * @returns {Promise<number>}
 */
export async function createOrder(data, conn) {
	const result = await execute(
		`
    INSERT INTO orders
    (user_id, status_id, delivery_type_id, is_paid, address, total_price)
    VALUES (?, 1, ?, 1, ?, ?)
    `,
		[data.user_id, data.delivery_type_id, data.address, data.total_price],
		conn
	);

	return result.insertId;
}

/**
 * Update order status
 * @param {number} orderId
 * @param {number} statusId
 * @returns {Promise<void>}
 */
export async function updateOrderStatus(orderId, statusId, conn) {
	await execute(
		`
    UPDATE orders
    SET status_id = ?, updated_at = NOW()
    WHERE id = ?
    `,
		[statusId, orderId],
		conn
	);
}

/**
 * Order counts by status (dashboard stats)
 */
export async function getOrderCountsByStatus() {
	return await select(
		`
    SELECT
      order_status.type AS status,
      COUNT(*) AS count

    FROM orders

    JOIN order_status
      ON order_status.id = orders.status_id

    GROUP BY order_status.type
    `
	);
}

/**
 * USER LOOGED
 */

/**
 * Get current active order for a user
 * (latest active order)
 */
export async function getActiveOrderByUser(userId) {
	const rows = await select(
		`
    ${ORDER_SELECT}
    ${ORDER_BASE}
    WHERE orders.user_id = ?
      AND order_status.type IN ('pending', 'confirmed', 'preparing', 'ready')
    ORDER BY orders.created_at DESC
    LIMIT 1
    `,
		[userId]
	);

	return rows[0] || null;
}
