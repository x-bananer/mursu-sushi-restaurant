import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import router from './routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// GLOBAL MIDDLEWARE
// ─────────────────────────────────────────────────────────────
app.use(cors());              // Enable CORS
app.use(express.json());      // Parse JSON bodies
app.use(morgan('dev'));      // Logging

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
// app.use(errorHandler);   TODO: Catch-all errors and handle it

// ─────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
