import request from 'supertest';
import app from '../../src/app.js';

describe('Cart API', () => {
	const sessionId = `${Date.now()}`;

	test('GET /cart returns 200 with session header', async () => {
		const res = await request(app).get('/api/v1/cart').set('x-session-id', sessionId);

		expect(res.status).toBe(200);
		const body = res.body;

		expect(body).toHaveProperty('cart');

		if (body.cart) {
			expect(typeof body.cart.total_price).toBe('number');
		}
	});

	test('PATCH /cart adds dish item', async () => {
		const res = await request(app).patch('/api/v1/cart').set('x-session-id', sessionId).send({
			dish_id: 1,
			quantity: 1,
		});

		expect(res.status).toBe(200);
		const body = res.body;

		expect(body).toHaveProperty('cart');

		expect(Array.isArray(body.cart.items)).toBe(true);
	});

	test('PATCH /cart with quantity 0 removes dish item', async () => {
		const res = await request(app).patch('/api/v1/cart').set('x-session-id', sessionId).send({
			dish_id: 1,
			quantity: 0,
		});

		expect(res.status).toBe(200);
		const body = res.body;

		expect(body).toHaveProperty('cart');

		expect(Array.isArray(body.cart.items)).toBe(true);
	});

	test('GET /cart without session id returns 400', async () => {
		const res = await request(app).get('/api/v1/cart');
		expect(res.status).toBe(400);
	});
});
