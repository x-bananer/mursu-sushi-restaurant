import Stripe from 'stripe';

import * as paymentRepository from '../../models/db/repositories/order/payment.repository.js';
import * as cartService from '../cart/cart.service.js';

const getPaymentStatus = async (type) => {
	const status = await paymentRepository.getPaymentStatusByStatusType(type);

	if (!status) {
		throw new Error(`Payment status not found`);
	}

	return status;
};

export const payWithStripe = async (userId, checkoutData) => {
	const pendingStatus = await getPaymentStatus('pending');
	const completedStatus = await getPaymentStatus('completed');
	const failedStatus = await getPaymentStatus('failed');

	const cart = await cartService.getCartByUserId(userId);

	if (!checkoutData.delivery_type_id || !checkoutData.address) {
		throw new Error('Missing checkout data');
	}

	if (!cart || !cart.items.length) {
		throw new Error('Cart is empty');
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

	const order = await cartService.checkoutCartByUserId(userId, {
		delivery_type_id: checkoutData.delivery_type_id,
		address: checkoutData.address,
	});

	await paymentRepository.attachOrderToPayment(paymentId, userId, order.id);
	await paymentRepository.updatePaymentStatusById(paymentId, userId, completedStatus.id);
	await cartService.clearCartByUserId(userId);

	return {
		order,
		payment: {
			id: paymentId,
			status: 'completed',
			order_id: order.id,
		},
	};
};
