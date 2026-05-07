import request from "supertest";
import app from "../../src/app.js";

describe("Payments API", () => {
	let token = "";

	const sessionId = `${Date.now()}`;

	const user = {
		name: `Mursr ${Date.now()}`,
		email: `mursu_${Date.now()}@mursu.com`,
		password: "Mursu123!",
	};

	beforeAll(async () => {
		const register = await request(app).post("/api/v1/auth/register").send(user);

		expect(register.status).toBe(201);

		const addToCart = await request(app).patch("/api/v1/cart").set("x-session-id", sessionId).send({
			dish_id: 1,
			quantity: 1,
		});

		expect(addToCart.status).toBe(200);

		const login = await request(app).post("/api/v1/auth/login").send({
			email: user.email,
			password: user.password,
		});

		expect(login.status).toBe(200);

		const body = login.body;
		token = body.token;
		expect(token).toBeDefined();
	});

	test("POST /payments/stripe without token returns 401", async () => {
		const res = await request(app)
			.post("/api/v1/payments/stripe")
			.set("x-session-id", sessionId)
			.send({
				delivery_type_id: 1,
				payment_method_id: "pm_card_visa",
			});

		expect(res.status).toBe(401);
	});

	test("POST /payments/stripe with token returns 200", async () => {
		const res = await request(app)
			.post("/api/v1/payments/stripe")
			.set("Authorization", `Bearer ${token}`)
			.set("x-session-id", sessionId)
			.send({
				delivery_type_id: 1,
				payment_method_id: "pm_card_visa",
			});

		expect(res.status).toBe(200);
		const body = res.body;
		
		expect(body).toHaveProperty("payment");
		expect(body).toHaveProperty("order");
	});
});
