import * as authService from "../services/auth/auth.service.js";
import * as cartService from "../services/cart/cart.service.js";

export async function register(req, res, next) {
	try {
		const result = await authService.register(req.body || {});

		// Attach cart to user when user gets user_id after auth.
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		if (sessionId) {
			await cartService.addUserIdToCart(sessionId, result?.user?.id);
		}

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
		if (sessionId) {
			await cartService.addUserIdToCart(sessionId, result?.user?.id);
		}

		res.json(result);
	} catch (error) {
		next(error);
	}
}

export async function logout(req, res, next) {
	try {
		res.status(204).send();
	} catch (error) {
		next(error);
	}
}

export async function refresh(req, res, next) {
	try {
		const result = await authService.refresh(req.user?.id);
		res.json(result);
	} catch (error) {
		next(error);
	}
}
