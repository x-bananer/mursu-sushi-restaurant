import { select, execute } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/order.type.js").OrderItems} OrderItems
 */

/**
 * ORDER ITEMS WITH ITEM TYPE + DISH JOIN
 * @param {number} orderId
 * @returns {Promise<OrderItems[]>}
 */
export async function getOrderItems(orderId) {
  const rows = await select(
    `
    SELECT
      order_items.*,

      -- item type
      order_item_type.id   AS item_type_id,
      order_item_type.type AS item_type_type,
      order_item_type.name AS item_type_name,

      -- dish metadata (ONLY for dish items)
      dishes.id          AS dish_id,
      dishes.name        AS dish_name,
      dishes.description AS dish_description,
      dishes.price       AS dish_price,
      dishes.created_at  AS dish_created_at

    FROM order_items

    JOIN order_item_type
      ON order_item_type.id = order_items.item_type_id

    LEFT JOIN dishes
      ON dishes.id = order_items.dish_id

    WHERE order_items.order_id = ?
    `,
    [orderId]
  );

  return /** @type {OrderItems[]} */ (rows);
}

/**
 * LIST ITEMS BY ORDER IDS WITH ITEM TYPE + DISH JOIN
 * @param {number[]} orderIds
 * @returns {Promise<OrderItems[]>}
 */
export async function listItemsByOrderIds(orderIds) {
  if (!orderIds.length) return [];

  const placeholders = orderIds.map(() => '?').join(',');

  const rows = await select(
    `
    SELECT
      order_items.*,

      -- item type
      order_item_type.id   AS item_type_id,
      order_item_type.type AS item_type_type,
      order_item_type.name AS item_type_name,

      -- dish metadata (ONLY for dish items)
      dishes.id          AS dish_id,
      dishes.name        AS dish_name,
      dishes.description AS dish_description,
      dishes.price       AS dish_price,
      dishes.created_at  AS dish_created_at

    FROM order_items

    JOIN order_item_type
      ON order_item_type.id = order_items.item_type_id

    LEFT JOIN dishes
      ON dishes.id = order_items.dish_id

    WHERE order_items.order_id IN (${placeholders})
    `,
    orderIds
  );

  return /** @type {OrderItems[]} */ (rows);
}

/**
 * Create a single order item (snapshot of cart item)
 */
export async function createOrderItem(data) {
  const result = await execute(
    `
    INSERT INTO order_items
      (order_id, dish_id, item_type_id, quantity, price)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.order_id,
      data.dish_id,
      data.item_type_id,
      data.quantity,
      data.price
    ]
  );

  return result.insertId;
}
