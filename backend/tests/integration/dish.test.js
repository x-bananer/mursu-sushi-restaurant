import request from 'supertest';
import app from '../../src/app.js';

describe('Dish API', () => {
	test('GET /dishes returns 200', async () => {
		const res = await request(app).get('/api/v1/dishes');
		expect(res.status).toBe(200);

		const body = res.body;

		expect(body).toBeDefined();

		expect(Array.isArray(body.dishes)).toBe(true);

		if (body.dishes.length > 0) {
			const dish = body.dishes[0];
			expect(dish).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					name: expect.any(String),
					category_id: expect.any(Number),
					description: expect.any(String),
					price: expect.any(Number),
					is_available: expect.any(Boolean),
					created_at: expect.any(String),
					badges: expect.any(Array),
				})
			);

			if (dish.badges.length > 0) {
				const badge = dish.badges[0];
				expect(badge).toEqual(
					expect.objectContaining({
						id: expect.any(Number),
						name: expect.any(String),
					})
				);
			}
		}
	});

	test('GET /dishes/:dish_id returns 200', async () => {
		const res = await request(app).get('/api/v1/dishes/1');
		expect(res.status).toBe(200);

		const body = res.body;
		const dish = body.dish?.[0];

		expect(dish).toEqual(
			expect.objectContaining({
				id: 1,
				name: expect.any(String),
				category_id: expect.any(Number),
				description: expect.any(String),
				price: expect.any(Number),
				is_available: expect.any(Boolean),
			})
		);
	});

	test('GET /dishes/categories returns 200', async () => {
		const res = await request(app).get('/api/v1/dishes/categories');
		expect(res.status).toBe(200);

		const body = res.body;
		expect(body).toBeDefined();
		expect(Array.isArray(body.categories)).toBe(true);

		if (body.categories.length > 0) {
			const category = body.categories[0];
			expect(category).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					name: expect.any(String),
					sort_order: expect.any(Number),
				})
			);
		}
	});

	test('GET /dishes/daily-special returns 200', async () => {
		const res = await request(app).get('/api/v1/dishes/daily-special');
		expect(res.status).toBe(200);

		const body = res.body;
		expect(body).toBeDefined();
		expect(Array.isArray(body.dish)).toBe(true);

		if (body.dish.length > 0) {
			const dish = body.dish[0];
			expect(dish).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					name: expect.any(String),
					category_id: expect.any(Number),
					description: expect.any(String),
					price: expect.any(Number),
					is_available: expect.any(Boolean),
					created_at: expect.any(String),
					badges: expect.any(Array),
				})
			);
		}
	});
});
