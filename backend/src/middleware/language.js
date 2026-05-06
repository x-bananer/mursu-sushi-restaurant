export default function languageMiddleware(req, res, next) {
	const locale = req.headers["x-locale"];
	req.lang = locale;
	
	next();
}
