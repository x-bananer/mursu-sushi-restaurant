import * as paymentService from '../services/integrations/payment.service.js';
import * as cartService from '../services/cart/cart.service.js';

export async function initiate(req, res, next) {
	try {
		// TODO: get userId from request when auth is ready
		const userId = 2;
		const cart = await cartService.getCartByUserId(userId);

		if (!cart || !cart.items.length) {
			return res.status(400).json({ message: 'Cart is empty' });
		}

		const payment = await paymentService.initiateMobilePayPayment(userId, cart.total_price);
		res.json({ payment });
	} catch (err) {
		next(err);
	}
}

export async function confirm(req, res, next) {
	try {
		const paymentId = Number(req.params.id);
		if (Number.isNaN(paymentId)) {
			return res.status(400).json({ message: 'Invalid payment id' });
		}

		// TODO: get userId from request when auth is ready
		const userId = 2;
		const { delivery_type_id, address } = req.body;

		const order = await cartService.checkoutCartByUserId(userId, {
			delivery_type_id,
			address,
		});

		await paymentService.attachOrderToPayment(paymentId, userId, order.id);
		
		const payment = await paymentService.confirmMobilePayPayment(paymentId, userId);
		
		await cartService.clearCartByUserId(userId);

		res.json({ order, payment });
	} catch (err) {
		next(err);
	}
}

export async function fail(req, res, next) {
	try {
		const paymentId = Number(req.params.id);
		if (Number.isNaN(paymentId)) {
			return res.status(400).json({ message: 'Invalid payment id' });
		}

		// TODO: get userId from request when auth is ready
		const userId = 2;
		const payment = await paymentService.failMobilePayPayment(paymentId, userId);
		res.json({ payment });
	} catch (err) {
		next(err);
	}
}
