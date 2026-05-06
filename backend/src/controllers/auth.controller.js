import * as authService from "../services/auth/auth.service.js";
import * as cartService from "../services/cart/cart.service.js";
import { placeholder } from "../utils/paceholder.js";

/**
 * @api {post} /api/v1/auth/register Register user
 * @apiName Register
 * @apiGroup Auth
 * @apiHeader {String} [x-session-id] Optional guest session id.
 * @apiBody {String} name User name.
 * @apiBody {String} email User email.
 * @apiBody {String} password User password.
 * @apiBody {Number} [role_id=1] Role id.
 * @apiBody {String} [adminSecret] Required for admin creation.
 * @apiSuccess {Object} user Public user object.
 * @apiSuccess {String} token JWT token.
 */
export async function register(req, res, next) {
	try {
		const result = await authService.register(req.body || {}, req.locale);

		// Attach cart to user when user gets user_id after auth.
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		if (sessionId) {
			await cartService.addUserIdToCart(sessionId, result?.user?.id, req.locale);
		}

		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
}

/**
 * @api {post} /api/v1/auth/login Login user
 * @apiName Login
 * @apiGroup Auth
 * @apiHeader {String} [x-session-id] Optional guest session id.
 * @apiBody {String} email User email.
 * @apiBody {String} password User password.
 * @apiSuccess {Object} user Public user object.
 * @apiSuccess {String} token JWT token.
 * @apiError (401) Unauthorized Invalid credentials.
 */
export async function login(req, res, next) {
	try {
		const result = await authService.login(req.body || {}, req.locale);

		// Attach cart to user when user gets user_id after auth.
		const sessionId = String(req.headers["x-session-id"] ?? "").trim();
		if (sessionId) {
			await cartService.addUserIdToCart(sessionId, result?.user?.id, req.locale);
		}

		res.json(result);
	} catch (error) {
		next(error);
	}
}

/**
 * @api {post} /api/v1/auth/logout Logout user
 * @apiName Logout
 * @apiGroup Auth
 * @apiDescription Invalidates current auth session/token flow (implementation pending).
 *
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiSuccess (204) NoContent Logged out.
 * @apiError (401) Unauthorized Missing or invalid JWT.
 */
export const logout = placeholder("auth.logout");

/**
 * @api {post} /api/v1/auth/refresh Refresh auth token
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiDescription Refreshes access token for authenticated user (implementation pending).
 *
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiSuccess {String} token New JWT token.
 * @apiError (401) Unauthorized Missing or invalid JWT.
 */
export const refresh = placeholder("auth.refresh");
