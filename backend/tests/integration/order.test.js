import request from 'supertest';
import app from '../../src/app.js';

describe('Order Tracking API', () => {
	let token = '';

	let orderId = 0;

	const sessionId = `${Date.now()}`;

	const user = {
		name: `Mursr ${Date.now()}`,
		email: `mursu_${Date.now()}@mursu.com`,
		password: 'Mursu123!',
	};

	beforeAll(async () => {
		const register = await request(app).post('/api/v1/auth/register').send(user);
		expect(register.status).toBe(201);

		const login = await request(app).post('/api/v1/auth/login').send({
			email: user.email,
			password: user.password,
		});

		expect(login.status).toBe(200);
		const loginBody = login.body;

		token = loginBody.token;
		expect(token).toBeDefined();

		const addToCart = await request(app)
			.patch('/api/v1/cart')
			.set('x-session-id', sessionId)
			.send({
				dish_id: 1,
				quantity: 1,
			});

		expect(addToCart.status).toBe(200);

		const res = await request(app)
			.post('/api/v1/payments/stripe')
			.set('Authorization', `Bearer ${token}`)
			.set('x-session-id', sessionId)
			.send({
				delivery_type_id: 1,
				payment_method_id: 'pm_card_visa',
			});

		expect(res.status).toBe(200);
		const paymentBody = res.body;

		expect(paymentBody).toHaveProperty('payment');
		expect(paymentBody).toHaveProperty('order');

		if (!paymentBody.order?.id) {
			throw new Error(
				`Stripe payment did not create order. Payment status: ${paymentBody.payment?.status}`
			);
		}

		orderId = paymentBody.order.id;
		expect(orderId).toBeDefined();
	});

	test('GET /orders/:id/tracking returns history', async () => {
		const res = await request(app).get(`/api/v1/orders/${orderId}/tracking`);
		expect(res.status).toBe(200);
		const body = res.body;

		expect(Array.isArray(body.history)).toBe(true);

		if (body.history.length > 0) {
			const record = body.history[0];
			expect(record).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					order_id: orderId,
					status_id: expect.any(Number),
					changed_at: expect.any(String),
				})
			);
		}
	});
});
