import * as authService from "../services/auth/auth.service.js";

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
