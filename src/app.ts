import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import flashcardsRouter from './routes/flashcards';
import authRouter from './routes/auth';
import { validateEnv, getOptionalEnv } from './lib/env';
import { prisma } from './lib/prisma';
import { MAX_JSON_REQUEST_SIZE } from './lib/constants';

// Validate environment variables on load (throws if any are missing)
validateEnv();

const app = express();
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

// Serve static files from React app build (used by `npm start`; on Vercel the CDN serves client/dist)
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

export default app;
