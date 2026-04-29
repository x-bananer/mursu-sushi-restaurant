/**
 * POST /payments/stripe
 * Initiate payment for authenticated user and active session cart.
 */

/**
 * @typedef {Object} InitiatePaymentRequest
 * @property {number} delivery_type_id
 * @property {string} address
 * @property {string} [payment_result]
 * @property {string} [payment_method_id]
 */

/**
 * @typedef {Object} InitiatePaymentResponse
 * @property {Object} payment
 * @property {number} payment.id
 * @property {string} payment.status
 * @property {number} [payment.order_id]
 * @property {import('../dto/order.type.js').OrderDTO} [order]
 */

/**
 * HTTP request type for authenticated payment endpoint.
 */
/**
 * @typedef {import('express').Request<{}, InitiatePaymentResponse, InitiatePaymentRequest> & {
 *   user?: { id?: number | string, roleId?: number | null }
 * }} InitiatePaymentHttpRequest
 */
