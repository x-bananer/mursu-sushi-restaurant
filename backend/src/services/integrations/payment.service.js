import * as paymentRepository from '../../models/db/repositories/order/payment.repository.js';
import * as cartService from '../cart/cart.service.js';

const getPaymentStatus = async (type) => {
	const status = await paymentRepository.getPaymentStatusByStatusType(type);

	if (!status) {
		throw new Error(`Payment status not found`);
	}

	return status;
};

export const payWithMobilePay = async (userId, checkoutData) => {
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

	// TODO temporary dummy data instead of real ref
	const providerRef = `${Date.now()}`;

	const paymentData = {
		user_id: userId,
		amount: Number(cart.total_price),
		status_id: pendingStatus.id,
		provider: 'mobilepay',
		provider_ref: providerRef,
	};
	const paymentId = await paymentRepository.initiatePayment(paymentData);

	if (checkoutData.payment_result === 'fail') {
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
