import jwt from "jsonwebtoken";

function createHttpError(statusCode, message) {
	const error = new Error(message);
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
		const payload = jwt.verify(token, getJwtSecret());

		if (!payload || !payload.id) {
			throw createHttpError(401, "Invalid token payload");
		}

		const parsedRoleId = Number(payload.roleId);
		let roleId = null;

		if (Number.isInteger(parsedRoleId)) {
			roleId = parsedRoleId;
		}

		req.user = {
			id: payload.id,
			roleId,
		};

		next();
	} catch (error) {
		next(error);
	}
}
