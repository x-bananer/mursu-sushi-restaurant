import dotenv from "dotenv";
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api/v1";

describe("Auth API", () => {
	const user = {
		name: `Mursr ${Date.now()}`,
		email: `mursu_${Date.now()}@mursu.com`,
		password: "Mursu123!",
	};

	test("POST /auth/register creates user", async () => {
		const res = await fetch(`${API_BASE_URL}/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(user),
		});

		expect(res.status).toBe(201);
		const body = await res.json();
		expect(body).toHaveProperty("token");
		expect(body).toHaveProperty("user");
		expect(body.user).toEqual(
			expect.objectContaining({
				email: user.email,
				name: user.name,
			}),
		);
	});

	test("POST /auth/login returns token for valid credentials", async () => {
		const res = await fetch(`${API_BASE_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: user.email,
				password: user.password,
			}),
		});

		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toHaveProperty("token");
		expect(body).toHaveProperty("user");
		expect(body.user.email).toBe(user.email);
	});

	test("POST /auth/login returns 401 for invalid password", async () => {
		const res = await fetch(`${API_BASE_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: user.email,
				password: "NotMursu123!",
			}),
		});

		expect(res.status).toBe(401);
	});
});
