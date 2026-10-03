import { getOptionalEnv } from './lib/env';
import { DEFAULT_PORT } from './lib/constants';

// Load the app inside try/catch so a failed env validation exits with a clear message
let app: typeof import('./app').default;
try {
  app = require('./app').default;
} catch (error) {
  console.error('❌ Environment validation failed:');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const PORT = parseInt(getOptionalEnv('PORT'), 10) || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
