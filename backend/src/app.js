import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import router from './routes.js';
import errorHandler from './middleware/errorHandler.js';
import languageMiddleware from './middleware/language.js';

const app = express();

// ─────────────────────────────────────────────────────────────
// GLOBAL MIDDLEWARE
// ─────────────────────────────────────────────────────────────
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging
app.use('/uploads', express.static('uploads')); // Serve uploaded user photos
app.use(languageMiddleware);

// ─────────────────────────────────────────────────────────────
// API DOCUMENTATION
// ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
	res.send('API documentation coming soon 🚀');
});

// ─────────────────────────────────────────────────────────────
// ROUTES
// All routes will be prefixed with /api/v1 for versioning
// Example: /api/v1/auth/login
// ─────────────────────────────────────────────────────────────
app.use('/api/v1', router);

// ─────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
