import dotenv from "dotenv";
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api/v1";
const SESSION_ID = `${Date.now()}`;

describe("Combo API", () => {
	let validCombo = [];
	let invalidCombo = [];

	test("GET /dishes/combo/ingredients returns 200", async () => {
		const res = await fetch(`${API_BASE_URL}/dishes/combo/ingredients`);
		expect(res.status).toBe(200);

		const body = await res.json();

		expect(Array.isArray(body.ingredients)).toBe(true);

		const base = body.ingredients.find((item) => {
			return item.ingredient_type_id === 1;
		});

		const fillings = body.ingredients
			.filter((item) => {
				return item.ingredient_type_id === 2;
			})
			.slice(0, 3);

		const topping = body.ingredients.find((item) => {
			return item.ingredient_type_id === 3;
		});

		expect(base).toBeDefined();
		expect(topping).toBeDefined();
		expect(fillings.length).toBeGreaterThan(0);

		validCombo = [
			{
				ingredient_id: base.id,
				quantity: 1,
				position: 1
			},
			...fillings.map((item, index) => ({
				ingredient_id: item.id,
				quantity: 1,
				position: index + 2,
			})),
			{
				ingredient_id: topping.id,
				quantity: 1,
				position: fillings.length + 2,
			},
		];

		invalidCombo = [
			{ ingredient_id: topping.id, quantity: 1, position: 1 },
			{ ingredient_id: base.id, quantity: 1, position: 2 },
		];
	});

	test("POST /dishes/combo/preview with valid payload returns 200", async () => {
		const res = await fetch(`${API_BASE_URL}/dishes/combo/preview`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				ingredients: validCombo
			}),
		});

		expect(res.status).toBe(200);

		const body = await res.json();

		expect(body).toHaveProperty("combo");

		expect(body.combo.total_price).toBeDefined();
		expect(typeof body.combo.total_price).toBe("number");
	});

	test("POST /dishes/combo/create adds combo to cart", async () => {
		const res = await fetch(`${API_BASE_URL}/dishes/combo/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-session-id": SESSION_ID,
			},
			body: JSON.stringify({
				ingredients: validCombo
			}),
		});

		expect(res.status).toBe(200);

		const cart = await fetch(`${API_BASE_URL}/cart`, {
			headers: { "x-session-id": SESSION_ID },
		});

		expect(cart.status).toBe(200);

		const body = await cart.json();

		expect(body).toHaveProperty("cart");

		expect(Array.isArray(body.cart.items)).toBe(true);
		
		expect(body.cart.items.length).toBeGreaterThan(0);
	});

	test("POST /dishes/combo/create with invalid payload returns 400", async () => {
		const res = await fetch(`${API_BASE_URL}/dishes/combo/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-session-id": SESSION_ID,
			},
			body: JSON.stringify({
				ingredients: invalidCombo,
			}),
		});

		expect(res.status).toBe(400);
	});
});
