import * as authService from "../services/auth/auth.service.js";
import { placeholder } from "../utils/paceholder.js";

export async function register(req, res, next) {
	try {
		const result = await authService.register(req.body || {});
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
}

export async function login(req, res, next) {
	try {
		const result = await authService.login(req.body || {});
		res.json(result);
	} catch (error) {
		next(error);
	}
}

export const logout = placeholder("auth.logout");
export const refresh = placeholder("auth.refresh");
export const me = placeholder("auth.me");
