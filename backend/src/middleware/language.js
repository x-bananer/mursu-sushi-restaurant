export default function languageMiddleware(req, res, next) {
	const locale = req.headers['x-locale'];
	req.locale = locale === 'fi' ? 'fi' : 'en';
	
	next();
}
