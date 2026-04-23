import * as orderRepo from '../../models/db/repositories/order/order.repository.js';
import * as orderIngRepo from '../../models/db/repositories/order/customOrderIng.repository.js';
import * as orderItemsRepo from '../../models/db/repositories/order/orderItems.repository.js';
import * as statusHistoryRepo from '../../models/db/repositories/order/orderStatusHistory.repository.js';

import * as mapper from './order.mapper.js';
import * as tracker from './order.tracker.js';
import { OrderEngine } from '../../models/engine/order.engine.js';
import { withTransaction } from '../../models/db/connection.js';

/**
 * =========================================================
 * FULL ORDER (DTO)
 * =========================================================
 */

/**
 * PURPOSE:
 * Build full OrderDTO for API
 *
 * USED BY:
 * - GET /orders/:id
 * - GET /orders/:id/tracking
 */

export async function getOrder(orderId) {
  const order = await orderRepo.getOrderById(orderId);
  if (!order) return null;

  const items = await orderItemsRepo.getOrderItems(orderId);
  const ingredients = await orderIngRepo.getOrderIngredients(orderId);

  return mapper.toOrderDTO(order, items, ingredients);
}

/**
 * =========================================================
 * USER
 * =========================================================
 */

/**
 * PURPOSE:
 * Retrieve the logged user's current active order (if any).
 *
 * USED BY:
 * - GET /orders/active
 */

export async function getActiveOrderByUser(userId) {
  const order = await orderRepo.getActiveOrderByUser(userId);
  if (!order) return null;

  const items = await orderItemsRepo.getOrderItems(order.id);
  const ingredients = await orderIngRepo.getOrderIngredients(order.id);

  return mapper.toOrderDTO(order, items, ingredients);
}

/**
 * =========================================================
 * ADMIN / KITCHEN
 * =========================================================
 */

/**
 * PURPOSE:
 * Active orders for dashboard
 *
 * RETURNS: Full OrderDTO[] in a list fomat
 */

export async function getActiveOrders() {
  const orders = await orderRepo.getActiveOrders();
  if (!orders.length) return [];
  const orderIds = orders.map(o => o.id);

  const items = await orderItemsRepo.listItemsByOrderIds(orderIds);
  const ingredients = await orderIngRepo.listIngredientsByOrderIds(orderIds);

  return mapper.toOrderListDTO(orders, items, ingredients);
}

/**
 * PURPOSE:
 * Update status + track history + emit event
 */
// Helper to convert status string - id for DB
function mapStatusToId(status) {
  return {
    pending: 1,
    confirmed: 2,
    preparing: 3,
    ready: 4,
    delivered: 5,
    cancelled: 6,
  }[status];
}

export async function updateOrderStatus(orderId, nextStatus) {
  const updatedOrderId = await withTransaction(async (conn) => {

    const order = await orderRepo.getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const validation = OrderEngine.validateTransition(
      {
        status: order.status_type,
        is_paid: order.is_paid
      },
      nextStatus
    );

    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    const statusId = mapStatusToId(nextStatus);

    await orderRepo.updateOrderStatus(orderId, statusId, conn);
    await statusHistoryRepo.insertStatusChange(orderId, statusId, conn);

    return orderId;
  });

  // AFTER COMMIT
  const updatedDTO = await getOrder(updatedOrderId);

  tracker.emit({
    scope: 'admin',
    type: 'order_status_updated',
    payload: updatedDTO
  });

  tracker.emit({
    scope: 'user',
    orderId: updatedDTO.id,
    userId: updatedDTO.user?.id || null,
    type: 'order_status_updated',
    payload: {
      orderId: updatedDTO.id,
      status: updatedDTO.status,
      updatedAt: new Date()
    }
  });

  return updatedDTO;
}

/**
 * =========================================================
 * CREATION
 * =========================================================
 */

/**
 * PURPOSE:
 * Create order + init history + emit event
 */
export async function createOrder(data) {
	OrderEngine.validateCreateOrder(data);
	const orderId = await withTransaction(async (conn) => {
	// 1. Create order
    const orderId = await orderRepo.createOrder(data, conn);

    const items = data.order_items || [];

    // 2. Prepare bulk item rows
    const itemRows = items.map(item => ([
      orderId,
      item.dish_id || null,
      item.name,
      item.quantity,
      item.price,
      item.item_type_id
    ]));

    // 3. Bulk insert items
    let orderItemIds = [];

    if (itemRows.length) {
      const result = await orderItemsRepo.createOrderItem(itemRows, conn);

      // MySQL: reconstruct inserted IDs
      const firstId = result.insertId;
      orderItemIds = itemRows.map((_, i) => firstId + i);
    }

    // 4. Prepare ingredient rows (in memory only)
    const ingredientRows = [];

    items.forEach((item, index) => {
      if (item.item_type_id === 2 && item.ingredients?.length) {
        const orderItemId = orderItemIds[index];

        item.ingredients.forEach(ing => {
          ingredientRows.push([
            orderItemId,
            ing.ingredient_id,
            ing.quantity,
            ing.position
          ]);
        });
      }
    });

    // 5. Bulk insert ingredients
    if (ingredientRows.length) {
      await orderIngRepo.createCustomOrderItemIng(ingredientRows, conn);
    }

    // 6. Status history
    await statusHistoryRepo.insertStatusChange(orderId, 1, conn);

	return orderId; // RETURN ONLY ID
  });

	// 7. mapp order into DTO format and emmit event
	const orderDTO = await getOrder(orderId);

    // ADMIN EVENT (full)
    tracker.emit({
      scope: 'admin',
      type: 'order_created',
      payload: orderDTO
    });

    // USER EVENT (minimal)
    tracker.emit({
      scope: 'user',
      userId: orderDTO.user?.id || orderDTO.user_id || null,
  	  orderId: orderDTO.id,
      type: 'order_created',
      payload: {
        orderId: orderDTO.id,
        status: orderDTO.status,
        createdAt: orderDTO.created_at
      }
    });

    return orderDTO;
}

/**
 * =========================================================
 * TRACKING
 * =========================================================
 */

/**
 * PURPOSE:
 * Timeline data
 */
export async function getOrderHistory(orderId) {
  return await statusHistoryRepo.getHistoryByOrderId(orderId);
}

/**
 * =========================================================
 * STATS
 * =========================================================
 */

/**
 * PURPOSE:
 * Dashboard counts
 */
export async function getOrderCountsByStatus() {
  return await orderRepo.getOrderCountsByStatus();
}
