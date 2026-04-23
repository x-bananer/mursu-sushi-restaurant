/**
 * @typedef {import('../../types/controllers/order.type.js').OrdersRequest} OrdersRequest
 * @typedef {import('../../types/controllers/order.type.js').OrdersResponse} OrdersResponse
 * @typedef {import('../../types/controllers/order.type.js').OrderRequest} OrderRequest
 * @typedef {import('../../types/controllers/order.type.js').OrderResponse} OrderResponse
 * @typedef {import('../../types/controllers/order.type.js').OrderTrackingRequest} OrderTrackingRequest
 * @typedef {import('../../types/controllers/order.type.js').OrderTrackingResponse} OrderTrackingResponse
 */

import { placeholder } from '../utils/paceholder.js';

import * as tracker from '../services/order/order.tracker.js';
import * as orderService from '../services/order/order.service.js';

/**
 * =========================================================
 * ADMIN / KITCHEN
 * =========================================================
 */

/**
 * GET /orders
 *
 * PURPOSE:
 * Returns ALL ACTIVE orders for the kitchen dashboard.
 *
 * WHY:
 * Kitchen needs to see what to prepare in real-time.
 *
 * DATA:
 * - order metadata (id, address, total, timestamps)
 * - status (type + name -> used for filtering & UI labels)
 * - delivery type (for logistics)
 *
 * NOTE:
 * Only returns active orders (pending -> ready)
 *
 * @param {import('express').Request<OrdersRequest>} req
 * @param {import('express').Response<OrdersResponse>} res
 * @param {import('express').NextFunction} next
 */
export async function list(req, res, next) {
  try {
    const orders = await orderService.getActiveOrders();
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:id
 *
 * PURPOSE:
 * Get FULL details of a single order (admin or user view)
 *
 * WHY:
 * Used when opening an order (details modal / page)
 *
 * DATA:
 * - order metadata
 * - items (what was ordered)
 * - ingredients (customizations)
 *
 * NOTE:
 * This is your "full order view"
 *
 * @param {import('express').Request<OrderRequest>} req
 * @param {import('express').Response<OrderResponse>} res
 * @param {import('express').NextFunction} next
 */
export async function get(req, res, next) {
  try {
    const orderId = Number(req.params.id);
	if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await orderService.getOrder(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /orders/:id/status
 *
 * PURPOSE:
 * Update the status of an order as it moves through the lifecycle
 * (e.g. pending → preparing → ready → delivered).
 *
 * WHO USES THIS:
 * - Kitchen dashboard
 * - Admin panel
 * - Order tracking system
 *
 * WHY THIS EXISTS:
 * Orders are state machines. Status changes must be controlled,
 * validated, and persisted in a consistent way.
 *
 * INPUT:
 * - params:
 *   - id: number (order ID)
 *
 * - body:
 *   - status: string
 *     (e.g. "pending", "preparing", "ready", "delivered", "cancelled")
 *
 * VALIDATION:
 * - orderId must be a valid number
 * - status must be a valid transition defined in OrderEngine
 *
 * SIDE EFFECTS (handled in service):
 * - Updates orders.status_id
 * - Inserts entry into order_status_history
 * - Emits real-time events (admin + user scopes)
 *
 * RESPONSE:
 * - success: boolean
 * - order: updated OrderDTO (current state of the order)
 */
export async function updateStatus(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Missing status' });
    }

    const updatedOrder = await orderService.updateOrderStatus(orderId, status);

    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (err) {
    next(err);
  }
}

/**
 * =========================================================
 * USER LOGGED IN
 * =========================================================
 */

/**
 * GET /orders/active
 *
 * PURPOSE:
 * Get the user's current active order
 *
 * WHY:
 * User typically has ONE ongoing order at a time.
 * Used for tracking page entry.
 *
 * DATA:
 * - latest active order (pending - ready)
 */
export async function getActive(req, res, next) {
  try {
	if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.user.id;

    const order = await orderService.getActiveOrderByUser(userId);

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

/**
 * =========================================================
 * TRACKING (IN ORDER-TRACKER PAGE) and for USERS NOT LOGGED IN
 * =========================================================
 */

/**
 * GET /orders/:id/tracking
 *
 * PURPOSE:
 * Get tracking data for timeline UI
 *
 * WHY:
 * Frontend shows:
 * "Order placed -> Preparing -> Ready"
 *
 * DATA:
 * - order (current state)
 * - history (all past status changes)
 *
 * THIS POWERS:
 * timeline UI
 *
 */
export async function tracking(req, res, next) {
  try {
    const orderId = Number(req.params.id);
	if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await orderService.getOrder(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const history = await orderService.getOrderHistory(orderId);

    res.json({ order, history });
  } catch (err) {
    next(err);
  }
}

/**
 * =========================================================
 * REAL-TIME (SSE STREAM)
 * =========================================================
 */

/**
 * GET /orders/:id/stream
 *
 * PURPOSE:
 * Real-time updates using Server-Sent Events (SSE)
 *
 * WHY:
 * Push updates to kitchen dashboard instantly
 * (new orders, status changes)
 *
 * DATA:
 * - streamed events (order updates)
 */

export function streamOrders(req, res) {
  const orderId = Number(req.params.id);

  if (Number.isNaN(orderId)) {
    return res.status(400).json({ message: 'Invalid order id' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  res.write('\n');

  tracker.subscribe(res, {
    scope: 'user',
    orderId,
    userId: req.user?.id ?? null
  });
}

/**
 * GET /orders/stats
 *
 * PURPOSE:
 * Get counts of orders per status
 *
 * WHY:
 * Dashboard indicators:
 * - "3 pending"
 * - "5 preparing"
 *
 * DATA:
 * - [{ status: 'pending', count: 3 }, ...]
 */
export async function stats(req, res, next) {
  try {
    const stats = await orderService.getOrderCountsByStatus();
    res.json({ stats });
  } catch (err) {
    next(err);
  }
}

/**
 * ONCE CART IS IMPLEMENTED POST /orders WILL BE REMOVES AS ENDPOINT:
 */

/**
 * POST /orders
 *
 * PURPOSE:
 * Create a new order (called by cart AFTER payment)
 *
 * WHY:
 * Cart owns payment - Orders only store confirmed orders
 *
 */
export async function create(req, res, next) {
  try {
	if (!req.body?.order_items) {
      return res.status(400).json({ message: 'Missing order items' });
    }

    const order = await orderService.createOrder(req.body);
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

// Needs to be moved to the cart or to its own controller.
export const initiatePayment    = placeholder('payments.initiate');
export const confirmPayment     = placeholder('payments.confirm');
export const paymentStatus      = placeholder('payments.status');
