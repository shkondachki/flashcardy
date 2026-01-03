import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
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
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(compression()); // Enable gzip compression for all responses

// CORS: Only needed in development when frontend runs on different port
// In production (single service), frontend is served from same domain, so CORS not needed
if (NODE_ENV === 'development' || getOptionalEnv('FRONTEND_URL')) {
  app.use(cors({
    origin: getOptionalEnv('FRONTEND_URL') || 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent
  }));
}

app.use(express.json({ limit: MAX_JSON_REQUEST_SIZE })); // Parse JSON bodies with size limit
app.use(cookieParser()); // Parse cookies

// API Routes (must come before static file serving)
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

// Serve static files from React app build
// In production, we're running from dist/, so go up one level to root, then into client/dist
const clientDistPath = path.resolve(process.cwd(), 'client/dist');
app.use(express.static(clientDistPath));

// SPA fallback: serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/auth') || req.path.startsWith('/flashcards') || req.path === '/health') {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
