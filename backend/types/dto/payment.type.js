/**
 * @typedef {Object} PaymentDTO
 * @property {number} id // from Payments table
 * @property {number} order_id
 * @property {number} amount
 * @property {import('../common.type.js').PaymentStatus} status
 * @property {string} provider
 * @property {string | null} provider_ref
 * @property {Date} created_at
 */
