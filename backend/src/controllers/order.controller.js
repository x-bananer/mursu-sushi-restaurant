/**
 * @typedef {import('../../types/controllers/order.type.js').OrdersRequest} OrdersRequest
 * @typedef {import('../../types/controllers/order.type.js').OrdersResponse} OrdersResponse
 * @typedef {import('../../types/controllers/order.type.js').OrderRequest} OrderRequest
 * @typedef {import('../../types/controllers/order.type.js').OrderResponse} OrderResponse
 * @typedef {import('../../types/controllers/order.type.js').OrderTrackingRequest} OrderTrackingRequest
 * @typedef {import('../../types/controllers/order.type.js').OrderTrackingResponse} OrderTrackingResponse
 * @typedef {import('express').Request & { locale: 'en' | 'fi' }} LocalizedRequest
 */

import * as tracker from '../services/order/order.tracker.js';
import * as orderService from '../services/order/order.service.js';
import { t } from '../i18n/messages.js';

/**
 * @api {get} /api/v1/adm/orders List active orders
 * @apiName ListActiveOrders
 * @apiGroup OrdersAdmin
 * @apiSuccess {Object[]} orders Active orders.
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
 * @api {get} /api/v1/adm/orders/:id Get order by id
 * @apiName GetOrderAdmin
 * @apiGroup OrdersAdmin
 * @apiParam {Number} id Order id.
 * @apiSuccess {Object} order Order DTO.
 * @apiError (400) BadRequest Invalid order id.
 * @apiError (404) NotFound Order not found.
 */
export async function get(req, res, next) {
	try {
		const orderId = Number(req.params.id);
		if (Number.isNaN(orderId)) {
			return res.status(400).json({ message: t(req.locale, 'order', 'invalid_order_id') });
		}

		const order = await orderService.getOrder(orderId);

		if (!order) {
			return res.status(404).json({ message: t(req.locale, 'order', 'order_not_found') });
		}

		res.json({ order });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {patch} /api/v1/adm/orders/:id/status Update order status
 * @apiName UpdateOrderStatus
 * @apiGroup OrdersAdmin
 * @apiParam {Number} id Order id.
 * @apiBody {String} status New status.
 * @apiSuccess {Boolean} success True.
 */
export async function updateStatus(req, res, next) {
	try {
		const orderId = Number(req.params.id);
		const { status } = req.body;
		if (Number.isNaN(orderId)) {
			return res.status(400).json({ message: t(req.locale, 'order', 'invalid_order_id') });
		}

		await orderService.updateOrderStatus(orderId, status, req.locale);

		res.json({ success: true });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {get} /api/v1/adm/orders/status/count Get order status counts
 * @apiName GetOrderStatusCount
 * @apiGroup OrdersAdmin
 * @apiSuccess {Object[]} stats Count items by status.
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
 * @api {get} /api/v1/adm/orders/stream Stream admin orders (SSE)
 * @apiName StreamAdminOrders
 * @apiGroup OrdersAdmin
 * @apiSuccess {String} event Stream events.
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
 * @api {post} /api/v1/adm/orders Create order
 * @apiName CreateOrderAdmin
 * @apiGroup OrdersAdmin
 * @apiBody {Number} user_id User id.
 * @apiBody {Number} delivery_type_id Delivery type id.
 * @apiBody {Number} total_price Total price.
 * @apiBody {Object[]} order_items Order items.
 * @apiSuccess (201) {Object} order Created order.
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
 * @api {get} /api/v1/orders/active Get active order
 * @apiName GetActiveOrder
 * @apiGroup OrdersTracking
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiSuccess {Object} order Active order or null.
 * @apiError (401) Unauthorized Missing/invalid token.
 */
export async function getActive(req, res, next) {
	try {
		if (!req.user) {
			return res.status(401).json({ message: t(req.locale, 'access', 'unauthorized') });
		}
		const userId = req.user.id;

		const order = await orderService.getActiveOrderByUser(userId);

		res.json({ order });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {get} /api/v1/orders/:id/tracking Get tracking history
 * @apiName GetOrderTracking
 * @apiGroup OrdersTracking
 * @apiParam {Number} id Order id.
 * @apiSuccess {Object[]} history Tracking history.
 */
export async function tracking(req, res, next) {
	try {
		const orderId = Number(req.params.id);
		if (Number.isNaN(orderId)) {
			return res.status(400).json({ message: t(req.locale, 'order', 'invalid_order_id') });
		}

		const history = await orderService.getOrderHistory(orderId);

		res.json({ history });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {get} /api/v1/orders/:id/stream Stream order updates (SSE)
 * @apiName StreamOrderUpdates
 * @apiGroup OrdersTracking
 * @apiParam {Number} id Order id.
 * @apiSuccess {String} event Stream events.
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
		return res.status(400).json({ message: t(req.locale, 'order', 'invalid_order_id') });
	}

	tracker.subscribe(res, {
		scope: 'user',
		orderId,
		userId: req.user?.id ?? null,
	});
}

/**
 * @api {get} /api/v1/orders/:id/estimate/:lat/:lon Get order ETA estimate
 * @apiName GetOrderEstimate
 * @apiGroup OrdersTracking
 * @apiParam {Number} id Order id.
 * @apiParam {Number} lat Latitude.
 * @apiParam {Number} lon Longitude.
 * @apiSuccess {Object} estimate Estimate payload.
 */
export async function estimate(req, res, next) {
	try {
		const orderId = Number(req.params.id);

		const lat = Number(req.params.lat);
		const lon = Number(req.params.lon);

		if (Number.isNaN(orderId)) {
			return res.status(400).json({ message: t(req.locale, 'order', 'invalid_order_id') });
		}

		let userCoords = null;
		if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
			userCoords = { lat, lon };
		}

		const result = await orderService.getOrderRoute(orderId, userCoords, req.locale);

		res.json({ estimate: result });
	} catch (err) {
		next(err);
	}
}

/**
 * @api {get} /api/v1/orders/:id/route/:mode/:lat/:lon Get route by mode
 * @apiName GetOrderRouteByMode
 * @apiGroup OrdersTracking
 * @apiParam {Number} id Order id.
 * @apiParam {String} mode Transport mode.
 * @apiParam {Number} lat Latitude.
 * @apiParam {Number} lon Longitude.
 * @apiSuccess {Object} route Route payload.
 */
export async function routeByMode(req, res, next) {
	try {
		const orderId = Number(req.params.id);
		const mode = req.params.mode;

		const lat = Number(req.params.lat);
		const lon = Number(req.params.lon);

		if (Number.isNaN(orderId)) {
			return res.status(400).json({ message: t(req.locale, 'order', 'invalid_order_id') });
		}

		if (!mode) {
			return res.status(400).json({ message: t(req.locale, 'order', 'mode_required') });
		}

		const userCoords = !Number.isNaN(lat) && !Number.isNaN(lon) ? { lat, lon } : null;

		const result = await orderService.getOrderRouteByMode(
			orderId,
			userCoords,
			mode,
			req.locale
		);

		res.json({ route: result });
	} catch (err) {
		next(err);
	}
}
