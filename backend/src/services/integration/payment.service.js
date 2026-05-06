import Stripe from 'stripe';

import * as paymentRepository from '../../models/db/repositories/order/payment.repository.js';
import * as cartService from '../cart/cart.service.js';
import { t } from '../../i18n/messages.js';

function createHttpError(statusCode, message) {
	const error = /** @type {Error & { statusCode: number }} */ (new Error(message));
	error.statusCode = statusCode;
	return error;
}

const getPaymentStatus = async (type, locale) => {
	const status = await paymentRepository.getPaymentStatusByStatusType(type);

	if (!status) {
		throw createHttpError(500, t(locale, 'payment', 'payment_status_not_found'));
	}

	return status;
};

export const payWithStripe = async (userId, sessionId, checkoutData, locale) => {
	if (!Number.isInteger(userId)) {
		throw createHttpError(401, t(locale, 'access', 'unauthorized'));
	}

	if (!sessionId) {
		throw createHttpError(400, t(locale, 'cart', 'missing_session_id'));
	}

	const pendingStatus = await getPaymentStatus('pending', locale);
	const completedStatus = await getPaymentStatus('completed', locale);
	const failedStatus = await getPaymentStatus('failed', locale);

	const cart = await cartService.getCartBySessionId(sessionId, locale);

	if (!checkoutData.delivery_type_id) {
		throw createHttpError(400, t(locale, 'cart', 'missing_checkout_data'));
	}

	if (Number(checkoutData.delivery_type_id) === 3 && !String(checkoutData.address ?? '').trim()) {
		throw createHttpError(400, t(locale, 'cart', 'address_required_for_delivery'));
	}

	if (!cart || !cart.items.length) {
		throw createHttpError(400, t(locale, 'cart', 'cart_empty'));
	}

	let providerRef = null;
	let isPaymentFailed = checkoutData.payment_result === 'fail';

	if (!isPaymentFailed) {
		try {
			const paymentIntent = await new Stripe(process.env.STRIPE_SECRET_KEY).paymentIntents.create({
				amount: Math.round(Number(cart.total_price) * 100),
				currency: 'eur',
				payment_method: checkoutData.payment_method_id || 'pm_card_visa',
				payment_method_types: ['card'],
				confirm: true,
			});

			console.log(paymentIntent, 'paymentIntent');

			providerRef = paymentIntent.id;
			isPaymentFailed = paymentIntent.status !== 'succeeded';
		} catch (error) {
			providerRef = error.payment_intent?.id || null;
			isPaymentFailed = true;
		}
	}

	if (!providerRef) {
		providerRef = `${Date.now()}`;
	}

	const paymentData = {
		user_id: userId,
		amount: Number(cart.total_price),
		status_id: pendingStatus.id,
		provider: 'stripe',
		provider_ref: providerRef,
	};
	const paymentId = await paymentRepository.initiatePayment(paymentData);

	if (isPaymentFailed) {
		await paymentRepository.updatePaymentStatusById(paymentId, userId, failedStatus.id);
		return {
			payment: {
				id: paymentId,
				status: 'failed',
			},
		};
	}

	const order = await cartService.checkoutCartBySessionId(sessionId, userId, {
		delivery_type_id: checkoutData.delivery_type_id,
		address: checkoutData.address,
	}, locale);

	await paymentRepository.attachOrderToPayment(paymentId, userId, order.id);
	await paymentRepository.updatePaymentStatusById(paymentId, userId, completedStatus.id);
	await cartService.clearCartBySessionId(sessionId, locale);

	return {
		order,
		payment: {
			id: paymentId,
			status: 'completed',
			order_id: order.id,
		},
	};
};
