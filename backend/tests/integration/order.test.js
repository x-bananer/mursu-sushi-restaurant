import dotenv from "dotenv";
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api/v1";

describe("Order Tracking API", () => {
	let token = "";

	let orderId = 0;

	const sessionId = `${Date.now()}`;

	const user = {
		name: `Mursr ${Date.now()}`,
		email: `mursu_${Date.now()}@mursu.com`,
		password: "Mursu123!",
	};

	beforeAll(async () => {
		const register = await fetch(`${API_BASE_URL}/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user),
		});
		expect(register.status).toBe(201);

		const login = await fetch(`${API_BASE_URL}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: user.email,
				password: user.password,
			}),
		});

		expect(login.status).toBe(200);
		const loginBody = await login.json();

		token = loginBody.token;
		expect(token).toBeDefined();

		const addToCart = await fetch(`${API_BASE_URL}/cart`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"x-session-id": sessionId,
			},
			body: JSON.stringify({
				dish_id: 1,
				quantity: 1,
			}),
		});

		expect(addToCart.status).toBe(200);

		const res = await fetch(`${API_BASE_URL}/payments/stripe`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
				"x-session-id": sessionId,
			},
			body: JSON.stringify({
				delivery_type_id: 1,
				payment_method_id: "pm_card_visa",
			}),
		});

		expect(res.status).toBe(200);

		const paymentBody = await res.json();

		expect(paymentBody).toHaveProperty("payment");
		expect(paymentBody).toHaveProperty("order");

		if (!paymentBody.order?.id) {
			throw new Error(`Stripe payment did not create order. Payment status: ${paymentBody.payment?.status}`);
		}

		orderId = paymentBody.order.id;
		expect(orderId).toBeDefined();
	});

	test("GET /orders/:id/tracking returns history", async () => {
		const res = await fetch(`${API_BASE_URL}/orders/${orderId}/tracking`);
		expect(res.status).toBe(200);

		const body = await res.json();

		expect(Array.isArray(body.history)).toBe(true);

		if (body.history.length > 0) {
			const record = body.history[0];
			expect(record).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					order_id: orderId,
					status_id: expect.any(Number),
					changed_at: expect.any(String),
				}),
			);
		}
	});
});
