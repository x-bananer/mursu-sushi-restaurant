import * as authService from "../services/auth/auth.service.js";
import * as cartService from "../services/cart/cart.service.js";
import { placeholder } from "../utils/paceholder.js";

export async function register(req, res, next) {
	try {
		const result = await authService.register(req.body || {});

		// Attach cart to user when user gets user_id after auth.
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		await cartService.addUserIdToCart(sessionId, result?.user?.id);

		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
}

export async function login(req, res, next) {
	try {
		const result = await authService.login(req.body || {});

		// Attach cart to user when user gets user_id after auth.
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		await cartService.addUserIdToCart(sessionId, result?.user?.id);

		res.json(result);
	} catch (error) {
		next(error);
	}
}

export const logout = placeholder("auth.logout");
export const refresh = placeholder("auth.refresh");
