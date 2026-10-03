// Vercel serverless entry point: the Express app handles /auth, /flashcards and /health
// (routed here by the rewrites in vercel.json). Static frontend files are served by Vercel's CDN.
import app from '../src/app';

export default app;
