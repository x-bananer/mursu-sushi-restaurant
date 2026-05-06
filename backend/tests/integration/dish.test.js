import dotenv from "dotenv";
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api/v1";

describe("Dish API", () => {
    test("GET /dishes returns 200", async () => {
        const res = await fetch(`${API_BASE_URL}/dishes`);
        expect(res.status).toBe(200);

        const body = await res.json();

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
                }),
            );

            if (dish.badges.length > 0) {
                const badge = dish.badges[0];
                expect(badge).toEqual(
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                    }),
                );
            }
        }

    });

    test("GET /dishes/:dish_id returns 200", async () => {
        const res = await fetch(`${API_BASE_URL}/dishes/1`);
        expect(res.status).toBe(200);

        const body = await res.json();
        const dish = body.dish[0];

        expect(dish).toEqual(
            expect.objectContaining({
                id: 1,
                name: expect.any(String),
                category_id: expect.any(Number),
                description: expect.any(String),
                price: expect.any(Number),
                is_available: expect.any(Boolean),
            }),
        );
    });

    test("GET /dishes/categories returns 200", async () => {
        const res = await fetch(`${API_BASE_URL}/dishes/categories`);
        expect(res.status).toBe(200);

        const body = await res.json();

        expect(body).toBeDefined();

        expect(Array.isArray(body.categories)).toBe(true);

        if (body.categories.length > 0) {
            const category = body.categories[0];
            expect(category).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    sort_order: expect.any(Number),
                }),
            );
        }
    });

    test("GET /dishes/daily-special returns 200", async () => {
        const res = await fetch(`${API_BASE_URL}/dishes/daily-special`);
        expect(res.status).toBe(200);

        const body = await res.json();

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
                }),
            );
        }
    });
});
