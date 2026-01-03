import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import flashcardsRouter from './routes/flashcards';
import authRouter from './routes/auth';
import { validateEnv, getOptionalEnv } from './lib/env';
import { prisma } from './lib/prisma';
import { DEFAULT_PORT, MAX_JSON_REQUEST_SIZE } from './lib/constants';

// Validate environment variables on startup
try {
  validateEnv();
} catch (error) {
  console.error('❌ Environment validation failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const app = express();
const PORT = parseInt(getOptionalEnv('PORT'), 10) || DEFAULT_PORT;

// Middleware
app.use(compression()); // Enable gzip compression for all responses
app.use(cors({
  origin: getOptionalEnv('FRONTEND_URL'),
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json({ limit: MAX_JSON_REQUEST_SIZE })); // Parse JSON bodies with size limit
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/auth', authRouter);
app.use('/flashcards', flashcardsRouter);

// Health check endpoint with database connectivity check
app.get('/health', async (req, res) => {
  try {
    // Verify database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
