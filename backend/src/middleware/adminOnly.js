import { t } from "../i18n/messages.js";

function createHttpError(statusCode, message) {
	const error = /** @type {Error & { statusCode: number }} */ (
		new Error(message)
	);
	error.statusCode = statusCode;
	return error;
}

const ADMIN_ROLE_ID = 2;

export default function adminOnly(req, res, next) {
	try {
		const locale = req.locale;
		if (!req.user) {
			throw createHttpError(401, t(locale, "access", "authentication_required"));
		}

		if (req.user.roleId === ADMIN_ROLE_ID) {
			next();
			return;
		}

		throw createHttpError(403, t(locale, "access", "admin_access_required"));
	} catch (error) {
		next(error);
	}
}
