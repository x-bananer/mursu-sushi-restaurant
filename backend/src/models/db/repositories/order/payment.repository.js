import { select, execute } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/order.type.js").Payments} Payments
 */

export const getPaymentStatusByStatusType = async (type) => {
	const rows = await select(
		`
    SELECT id, type, name
    FROM payment_status
    WHERE type = ?
    LIMIT 1
    `,
		[type]
	);

	return rows[0] || null;
};

export const getPaymentById = async (paymentId) => {
	const rows = await select(
		`
    SELECT
      payments.*,
      payment_status.type AS status_type,
      payment_status.name AS status_name
    FROM payments
    JOIN payment_status
      ON payment_status.id = payments.status_id
    WHERE payments.id = ?
    LIMIT 1
    `,
		[paymentId]
	);

	return /** @type {any|null} */ (rows[0] || null);
};

/**
 * Initiate payment
 * @param {Object} data
 * @returns {Promise<number>}
 */
export const initiatePayment = async (data) => {
	const result = await execute(
		`
    INSERT INTO payments
    (user_id, amount, status_id, provider, provider_ref)
    VALUES (?, ?, ?, ?, ?)
    `,
		[data.user_id, data.amount, data.status_id, data.provider, data.provider_ref]
	);

	return result.insertId;
};

export const updatePaymentStatusById = async (paymentId, userId, statusId) => {
	await execute(
		`
    UPDATE payments
    SET status_id = ?
    WHERE id = ? AND user_id = ?
    `,
		[statusId, paymentId, userId]
	);
};

export const attachOrderToPayment = async (paymentId, userId, orderId) => {
	await execute(
		`
    UPDATE payments
    SET order_id = ?
    WHERE id = ? AND user_id = ?
    `,
		[orderId, paymentId, userId]
	);
};
