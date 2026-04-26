import * as paymentService from '../services/integrations/payment.service.js';

export async function initiate(req, res, next) {
	try {
		// TODO: get userId from request when auth is ready
		const userId = 2;
		const { delivery_type_id, address, payment_result } = req.body;
		const result = await paymentService.payWithMobilePay(userId, {
			delivery_type_id,
			address,
			payment_result,
		});

		res.json(result);
	} catch (err) {
		next(err);
	}
}
