import dotenv from "dotenv";
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api/v1";

describe("Cart API", () => {
	const sessionId = `${Date.now()}`;

	test("GET /cart returns 200 with session header", async () => {
		const res = await fetch(`${API_BASE_URL}/cart`, {
			headers: {
				"x-session-id": sessionId,
			},
		});

		expect(res.status).toBe(200);

		const body = await res.json();

		expect(body).toHaveProperty("cart");
		
		if (body.cart) {
			expect(typeof body.cart.total_price).toBe("number");
		}

	});

	test("PATCH /cart adds dish item", async () => {
		const res = await fetch(`${API_BASE_URL}/cart`, {
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

		expect(res.status).toBe(200);

		const body = await res.json();

		expect(body).toHaveProperty("cart");

		expect(Array.isArray(body.cart.items)).toBe(true);
	});

	test("PATCH /cart with quantity 0 removes dish item", async () => {
		const res = await fetch(`${API_BASE_URL}/cart`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"x-session-id": sessionId,
			},
			body: JSON.stringify({
				dish_id: 1,
				quantity: 0,
			}),
		});

		expect(res.status).toBe(200);

		const body = await res.json();

		expect(body).toHaveProperty("cart");

		expect(Array.isArray(body.cart.items)).toBe(true);
	});

	test("GET /cart without session id returns 400", async () => {
		const res = await fetch(`${API_BASE_URL}/cart`);
		expect(res.status).toBe(400);
	});
});
