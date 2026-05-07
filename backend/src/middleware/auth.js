import jwt from "jsonwebtoken";
import { t } from "../i18n/messages.js";

function createHttpError(statusCode, message) {
	const error = /** @type {Error & { statusCode: number }} */ (
		new Error(message)
	);
	error.statusCode = statusCode;
	return error;
}

function getJwtSecret(locale) {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw createHttpError(500, t(locale, "auth", "jwt_secret_not_configured"));
	}

	return secret;
}

export default function auth(req, res, next) {
	try {
		const locale = req.locale;
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			throw createHttpError(401, t(locale, "auth", "auth_header_missing"));
		}

		const [scheme, token] = authHeader.split(" ");

		if (scheme !== "Bearer" || !token) {
			throw createHttpError(401, t(locale, "auth", "auth_token_invalid"));
		}

		const payload = jwt.verify(token, getJwtSecret(locale));

		if (
			typeof payload !== "object" ||
			payload === null ||
			!("id" in payload)
		) {
			throw createHttpError(401, t(locale, "auth", "invalid_token_payload"));
		}

		const payloadId = payload.id;

		if (typeof payloadId !== "number" && typeof payloadId !== "string") {
			throw createHttpError(401, t(locale, "auth", "invalid_token_payload"));
		}

		const rawRoleId = "roleId" in payload ? payload.roleId : null;

		const parsedRoleId = Number(rawRoleId);
		let roleId = null;

		if (Number.isInteger(parsedRoleId)) {
			roleId = parsedRoleId;
		}

		req.user = {
			id: payloadId,
			roleId,
		};

		next();
	} catch (error) {
		next(error);
	}
}
