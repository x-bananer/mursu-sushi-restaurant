import * as paymentService from '../services/integrations/payment.service.js';

/**
 * @param {import('../../types/controllers/payment.type.js').InitiatePaymentHttpRequest} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function initiate(req, res, next) {
	try {
		const userId = Number(req.user?.id);
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();

		const { delivery_type_id, address, payment_result, payment_method_id } = req.body;
		const result = await paymentService.payWithStripe(userId, sessionId, {
			delivery_type_id,
			address,
			payment_result,
			payment_method_id,
		});

		res.json(result);
	} catch (err) {
		next(err);
	}
}
