import request from 'supertest';
import app from '../../src/app.js';

describe('Auth API', () => {
	const user = {
		name: `Mursr ${Date.now()}`,
		email: `mursu_${Date.now()}@mursu.com`,
		password: 'Mursu123!',
	};

	test('POST /auth/register creates user', async () => {
		const res = await request(app).post('/api/v1/auth/register').send(user);

		expect(res.status).toBe(201);
		const body = res.body;
		expect(body).toHaveProperty('token');
		expect(body).toHaveProperty('user');
		expect(body.user).toEqual(
			expect.objectContaining({
				email: user.email,
				name: user.name,
			})
		);
	});

	test('POST /auth/login returns token for valid credentials', async () => {
		const res = await request(app).post('/api/v1/auth/login').send({
			email: user.email,
			password: user.password,
		});

		expect(res.status).toBe(200);
		const body = res.body;
		expect(body).toHaveProperty('token');
		expect(body).toHaveProperty('user');
		expect(body.user.email).toBe(user.email);
	});

	test('POST /auth/login returns 401 for invalid password', async () => {
		const res = await request(app).post('/api/v1/auth/login').send({
			email: user.email,
			password: 'NotMursu123!',
		});

		expect(res.status).toBe(401);
	});
});
