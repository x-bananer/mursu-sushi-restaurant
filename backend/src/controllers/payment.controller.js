import * as paymentService from '../services/integration/payment.service.js';

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
