import * as paymentService from '../services/integrations/payment.service.js';

export async function initiate(req, res, next) {
	try {
		// TODO: get userId from request when auth is ready
		const userId = 2;

		const { delivery_type_id, address, payment_result, payment_method_id } = req.body;
		const result = await paymentService.payWithStripe(userId, {
			delivery_type_id,
			address,
			payment_result,
			payment_method_id,
		});

		res.json(result);
	} catch (err) {
		return res.status(400).json({
			message: err instanceof Error ? err.message : "Payment failed",
		});
	}
}
