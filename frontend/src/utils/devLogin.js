/**
 * Temporary file only for development assitance till login and registration page is implemented.
 */

import { fetchData } from "./fetchData";

export default async function devLogin() {
	try {
		const data = await fetchData("/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: "dev@example.com",
				password: "password123",
			}),
		});

		// store token
		localStorage.setItem("token", data.token);
		localStorage.setItem("user", data.user);

		console.log("✅ Logged in dev user:", data);

		return data;
	} catch (err) {
		console.error("❌ Login failed:", err.message);
	}
}
