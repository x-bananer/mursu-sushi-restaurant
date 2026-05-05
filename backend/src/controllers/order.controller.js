/**
 * @typedef {import('../../types/controllers/order.type.js').OrdersRequest} OrdersRequest
 * @typedef {import('../../types/controllers/order.type.js').OrdersResponse} OrdersResponse
 * @typedef {import('../../types/controllers/order.type.js').OrderRequest} OrderRequest
 * @typedef {import('../../types/controllers/order.type.js').OrderResponse} OrderResponse
 * @typedef {import('../../types/controllers/order.type.js').OrderTrackingRequest} OrderTrackingRequest
 * @typedef {import('../../types/controllers/order.type.js').OrderTrackingResponse} OrderTrackingResponse
 */

import * as tracker from '../services/order/order.tracker.js';
import * as orderService from '../services/order/order.service.js';

/**
 * =========================================================
 * ADMIN / KITCHEN
 * =========================================================
 */

/**
 * GET /adm/orders
 * Returns ALL ACTIVE orders for the kitchen dashboard.
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
 * GET /adm/orders/:id
 * Get FULL details of a single order (admin or user view)
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
 * PATCH /adm/orders/:id/status
 * Update order status (kitchen workflow)
 */
export async function updateStatus(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;
	if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    await orderService.updateOrderStatus(orderId, status);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /adm/orders/status/count
 * Get counts of orders per status
 */
export async function statusCount(req, res, next) {
  try {
    const stats = await orderService.getOrderCountsByStatus();
    res.json({ stats });
  } catch (err) {
    next(err);
  }
}

/**
 * GET adm/orders/stream
 * Real-time order updates using Server-Sent Events (SSE)
 * Used when order is created.
 */
export function streamAdmOrders(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  res.write('\n');

  // ADMIN scope subscription (NO orderId needed)
  tracker.subscribe(res, {
    scope: 'admin',
    userId: req.user?.id ?? null,
  });
}

/**
 * ONCE CART IS IMPLEMENTED POST /orders WILL BE REMOVES AS ENDPOINT:
 */

/**
 * POST /adm/orders
 * Create a new order (called by cart AFTER payment)
 */
export async function create(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ order });
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
 * Get the user's current active order
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
 * GET /orders/:id/tracking
 * Get history tracking data for timeline UI
 */
export async function tracking(req, res, next) {
  try {
    const orderId = Number(req.params.id);
	if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const history = await orderService.getOrderHistory(orderId);

    res.json({ history });
  } catch (err) {
    next(err);
  }
}

/**
 * GET orders/:id/stream
 * Real-time order updates using Server-Sent Events (SSE)
 * Used when an order is updated by id
 */

export function streamOrders(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  res.write('\n');

  const orderId = Number(req.params.id);

  if (Number.isNaN(orderId)) {
    return res.status(400).json({ message: 'Invalid order id' });
  }

  tracker.subscribe(res, {
    scope: 'user',
    orderId,
    userId: req.user?.id ?? null
  });
}

/**
 * GET /orders/:id/estimate/:lat/:lon
 * Returns ETA + routing + kitchen timing for an order
 */
export async function estimate(req, res, next) {
  try {
    const orderId = Number(req.params.id);

    const lat = Number(req.params.lat);
    const lon = Number(req.params.lon);

    if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    let userCoords = null;
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      userCoords = { lat, lon };
    }

    const result = await orderService.getOrderRoute(orderId, userCoords);

    res.json({ estimate: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:id/route/:mode/:lat/:lon
 */
export async function routeByMode(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    const mode = req.params.mode;

    const lat = Number(req.params.lat);
    const lon = Number(req.params.lon);

    if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    if (!mode) {
      return res.status(400).json({ message: 'Mode required' });
    }

    const userCoords =
      !Number.isNaN(lat) && !Number.isNaN(lon)
        ? { lat, lon }
        : null;

    const result = await orderService.getOrderRouteByMode(
      orderId,
      userCoords,
      mode
    );

    res.json({ route: result });

  } catch (err) {
    next(err);
  }
}
