import * as paymentRepository from '../../models/db/repositories/order/payment.repository.js';

const getPaymentStatus = async (type) => {
  const status = await paymentRepository.getPaymentStatusByStatusType(type);

  if (!status) {
    throw new Error(`Payment status not found`);
  }

  return status;
};

/**
 * Initiate pending MobilePay payment for user cart
 * @param {number} userId
 * @param {number} amount
 */
export const initiateMobilePayPayment = async (userId, amount) => {
  const pendingStatus = await getPaymentStatus('pending');

  // TODO temporary dummy data instead of real ref
  const providerRef = `${Date.now()}`;

  const paymentId = await paymentRepository.initiatePayment({
    user_id: userId,
    amount: Number(amount),
    status_id: pendingStatus.id,
    provider: 'mobilepay',
    provider_ref: providerRef,
  });

  return await paymentRepository.getPaymentById(paymentId);
};

/**
 * Mark MobilePay payment as completed
 * @param {number} paymentId
 * @param {number} userId
 */
export const confirmMobilePayPayment = async (paymentId, userId) => {
  const pendingStatus = await getPaymentStatus('pending');
  const completedStatus = await getPaymentStatus('completed');

  const payment = await paymentRepository.getPaymentById(paymentId);

  if (!payment || payment.user_id !== userId) {
    throw new Error('Payment not found');
  }

  if (payment.status_id !== pendingStatus.id) {
    throw new Error('Payment is not pending');
  }

  await paymentRepository.updatePaymentStatusById(paymentId, userId, completedStatus.id);

  return await paymentRepository.getPaymentById(paymentId);
};

export const attachOrderToPayment = async (paymentId, userId, orderId) => {
  await paymentRepository.attachOrderToPayment(paymentId, userId, orderId);
  return await paymentRepository.getPaymentById(paymentId);
};

/**
 * Mark MobilePay payment as failed
 * @param {number} paymentId
 * @param {number} userId
 */
export const failMobilePayPayment = async (paymentId, userId) => {
  const pendingStatus = await getPaymentStatus('pending');
  const failedStatus = await getPaymentStatus('failed');

  const payment = await paymentRepository.getPaymentById(paymentId);

  if (!payment || payment.user_id !== userId) {
    throw new Error('Payment not found');
  }

  if (payment.status_id !== pendingStatus.id) {
    throw new Error('Payment is not pending');
  }

  await paymentRepository.updatePaymentStatusById(paymentId, userId, failedStatus.id);

  return await paymentRepository.getPaymentById(paymentId);
};
