import request from "supertest";
import app from "../../src/app.js";

describe("Combo API", () => {
	let validCombo = [];
	let invalidCombo = [];
	const sessionId = `${Date.now()}`;

	test("GET /dishes/combo/ingredients returns 200", async () => {
		const res = await request(app).get("/api/v1/dishes/combo/ingredients");
		expect(res.status).toBe(200);
		const body = res.body;

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
		const res = await request(app).post("/api/v1/dishes/combo/preview").send({
			ingredients: validCombo
		});

		expect(res.status).toBe(200);
		const body = res.body;

		expect(body).toHaveProperty("combo");

		expect(body.combo.total_price).toBeDefined();
		expect(typeof body.combo.total_price).toBe("number");
	});

	test("POST /dishes/combo/create adds combo to cart", async () => {
		const res = await request(app)
			.post("/api/v1/dishes/combo/create")
			.set("x-session-id", sessionId)
			.send({
				ingredients: validCombo
			});

		expect(res.status).toBe(200);

		const cart = await request(app).get("/api/v1/cart").set("x-session-id", sessionId);

		expect(cart.status).toBe(200);
		const body = cart.body;

		expect(body).toHaveProperty("cart");

		expect(Array.isArray(body.cart.items)).toBe(true);
		
		expect(body.cart.items.length).toBeGreaterThan(0);
	});

	test("POST /dishes/combo/create with invalid payload returns 400", async () => {
		const res = await request(app)
			.post("/api/v1/dishes/combo/create")
			.set("x-session-id", sessionId)
			.send({
				ingredients: invalidCombo,
			});

		expect(res.status).toBe(400);
	});
});
