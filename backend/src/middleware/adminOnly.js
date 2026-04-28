function createHttpError(statusCode, message) {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
}

const ADMIN_ROLE_ID = 2;

export default function adminOnly(req, res, next) {
	try {
		if (!req.user) {
			throw createHttpError(401, "Authentication required");
		}

		if (req.user.roleId === ADMIN_ROLE_ID) {
			next();
			return;
		}

		throw createHttpError(403, "Admin access required");
	} catch (error) {
		next(error);
	}
}
