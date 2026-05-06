import * as paymentService from '../services/integration/payment.service.js';

/**
 * @api {post} /api/v1/payments/stripe Pay with Stripe
 * @apiName PayWithStripe
 * @apiGroup Payments
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiHeader {String} x-session-id Session id.
 * @apiBody {Number} delivery_type_id Delivery type id.
 * @apiBody {String} [address] Delivery address.
 * @apiBody {String} [payment_method_id] Stripe payment method id.
 * @apiBody {String} [payment_result] Optional force-fail value for tests.
 * @apiSuccess {Object} payment Payment result.
 * @apiSuccess {Object} [order] Created order when payment succeeded.
 * @apiError (400) BadRequest Invalid checkout/cart state.
 * @apiError (401) Unauthorized Missing or invalid JWT.
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
		}, req.locale);

		res.json(result);
	} catch (err) {
		next(err);
	}
}
