import * as orderRepo from '../../models/db/repositories/order/order.repository.js';
import * as orderIngRepo from '../../models/db/repositories/order/customOrderIng.repository.js';
import * as orderItemsRepo from '../../models/db/repositories/order/orderItems.repository.js';
import * as statusHistoryRepo from '../../models/db/repositories/order/orderStatusHistory.repository.js';

import * as mapper from './order.mapper.js';
import * as tracker from './order.tracker.js';
import { OrderEngine } from '../../models/engine/order.engine.js';

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
  // 1. Get current order (DB layer)
  const order = await orderRepo.getOrderById(orderId);
  if (!order) throw new Error('Order not found');

  // 2. Validate transition (DOMAIN layer)
  const validation = OrderEngine.validateTransition(
    {
      status: order.status_type, // from JOIN
      is_paid: order.is_paid
    },
    nextStatus
  );

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  // 3. Convert to DB format
  const statusId = mapStatusToId(nextStatus);

  // 4. Persist
  await orderRepo.updateOrderStatus(orderId, statusId);
  await statusHistoryRepo.insertStatusChange(orderId, statusId);

  // 5. Build DTO (API layer)
  const updatedDTO = await getOrder(orderId);

  // 6. Emit events
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
 * USER
 * =========================================================
 */

/**
 * PURPOSE:
 * Get user's active order (DTO)
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
 * CREATION
 * =========================================================
 */

/**
 * PURPOSE:
 * Create order + init history + emit event
 */
export async function createOrder(data) {
  const orderId = await orderRepo.createOrder(data);

  await statusHistoryRepo.insertStatusChange(orderId, 1);

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
