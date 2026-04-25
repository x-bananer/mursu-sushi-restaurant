import jwt from "jsonwebtoken";

function createHttpError(statusCode, message) {
	const error = /** @type {Error & { statusCode: number }} */ (
		new Error(message)
	);
	error.statusCode = statusCode;
	return error;
}

function getJwtSecret() {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw createHttpError(500, "JWT secret is not configured");
	}

	return secret;
}

export default function auth(req, res, next) {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			throw createHttpError(401, "Authorization header is missing");
		}

		const [scheme, token] = authHeader.split(" ");

		if (scheme !== "Bearer" || !token) {
			throw createHttpError(401, "Authorization token is invalid");
		}

		const payload = jwt.verify(token, getJwtSecret());

		if (
			typeof payload !== "object" ||
			payload === null ||
			!("id" in payload)
		) {
			throw createHttpError(401, "Invalid token payload");
		}

		const payloadId = payload.id;

		if (typeof payloadId !== "number" && typeof payloadId !== "string") {
			throw createHttpError(401, "Invalid token payload");
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
