/**
 * @typedef {import('../../types/controllers/order.type.js').CreateOrderRequest} CreateOrderRequest
 * @typedef {import('../../types/controllers/order.type.js').CreateOrderResponse} CreateOrderResponse
 * @typedef {import('../../types/controllers/order.type.js').OrdersRequest} OrdersRequest
 * @typedef {import('../../types/controllers/order.type.js').OrdersResponse} OrdersResponse
 * @typedef {import('../../types/controllers/order.type.js').OrderRequest} OrderRequest
 * @typedef {import('../../types/controllers/order.type.js').OrderResponse} OrderResponse
 * @typedef {import('../../types/controllers/order.type.js').DeleteOrderRequest} DeleteOrderRequest
 * @typedef {import('../../types/controllers/order.type.js').DeleteOrderResponse} DeleteOrderResponse
 * @typedef {import('../../types/controllers/order.type.js').OrderTrackingRequest} OrderTrackingRequest
 * @typedef {import('../../types/controllers/order.type.js').OrderTrackingResponse} OrderTrackingResponse
 */

import { placeholder } from '../utils/paceholder.js';

import * as orderService from '../services/order/order.service.js';

/**
 * GET /orders
 * @param {import('express').Request<OrdersRequest>} req
 * @param {import('express').Response<OrdersResponse>} res
 * @param {import('express').NextFunction} next
 */
export async function list(req, res, next) {
  try {
    const orders = await orderService.listOrders();
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:id
 * @param {import('express').Request<OrderRequest>} req
 * @param {import('express').Response<OrderResponse>} res
 * @param {import('express').NextFunction} next
 */
export async function get(req, res, next) {
  try {
    const order = await orderService.getOrder(Number(req.params.id));

    if (!order) {
	  next(new Error('Order not found'));
	  return res.status(404);
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /orders
 * @param {import('express').Request<{}, {}, CreateOrderRequest>} req
 * @param {import('express').Response<CreateOrderResponse>} res
 * @param {import('express').NextFunction} next
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
 * DELETE /orders/:id (cancel order)
 * @param {import('express').Request<DeleteOrderRequest>} req
 * @param {import('express').Response<DeleteOrderResponse>} res
 * @param {import('express').NextFunction} next
 */
export async function cancelOrder(req, res, next) {
  try {
    await orderService.updateOrderStatus(
      Number(req.params.id),
      6 // cancelled status id
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:id/tracking
 * @param {import('express').Request<OrderTrackingRequest>} req
 * @param {import('express').Response<OrderTrackingResponse>} res
 * @param {import('express').NextFunction} next
 */
export async function tracking(req, res, next) {
  try {
    const order = await orderService.getOrder(Number(req.params.id));

    if (!order) {
      next(new Error('Order not found'));
	  return res.status(404);
    }

    // TODO: replace with tracking service later
    const history = [];

    res.json({ order, history });
  } catch (err) {
    next(err);
  }
}

export const initiatePayment    = placeholder('payments.initiate');
export const confirmPayment     = placeholder('payments.confirm');
export const paymentStatus      = placeholder('payments.status');
