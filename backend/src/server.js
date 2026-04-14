import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

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
// START SERVER
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
