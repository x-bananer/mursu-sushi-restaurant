import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api/v1";

describe("Payments API", () => {
	let token = "";

	const sessionId = `${Date.now()}`;

	const user = {
		name: `Mursr ${Date.now()}`,
		email: `mursu_${Date.now()}@mursu.com`,
		password: "Mursu123!",
	};

	beforeAll(async () => {
		const register = await fetch(`${API_BASE_URL}/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(user),
		});

		expect(register.status).toBe(201);

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

		const body = await login.json();
		token = body.token;
		expect(token).toBeDefined();
	});

	test("POST /payments/stripe without token returns 401", async () => {
		const res = await fetch(`${API_BASE_URL}/payments/stripe`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-session-id": sessionId,
			},
			body: JSON.stringify({
				delivery_type_id: 1,
				payment_method_id: "pm_card_visa",
			}),
		});

		expect(res.status).toBe(401);
	});

	test("POST /payments/stripe with token returns 200", async () => {
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

		const body = await res.json();
		
		expect(body).toHaveProperty("payment");
		expect(body).toHaveProperty("order");
	});
});
