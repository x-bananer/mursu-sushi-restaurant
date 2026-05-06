import { t } from "../i18n/messages.js";

export default function errorHandler(err, req, res, next) {
	if (res.headersSent) {
		next(err);
		return;
	}

	const statusCode = err && err.statusCode ? err.statusCode : 500;
	const message =
		err && err.message ? err.message : t(req.locale, 'common', 'internal_error');
	const response = { message };

	if (process.env.NODE_ENV !== "production") {
		response.stack = err && err.stack ? err.stack : undefined;
	}

	res.status(statusCode).json(response);
}
