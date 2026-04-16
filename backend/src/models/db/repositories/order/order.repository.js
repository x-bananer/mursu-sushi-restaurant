import { select } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/order.type.js").Orders} Orders
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

