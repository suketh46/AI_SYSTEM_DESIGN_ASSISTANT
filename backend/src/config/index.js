const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  github: {
    token: process.env.GITHUB_TOKEN,
    model: process.env.GITHUB_MODEL || 'gpt-4o',
    baseUrl: process.env.GITHUB_MODELS_BASE_URL || 'https://models.inference.ai.azure.com',
  },
};

if (!config.github.token) {
  console.error('FATAL: GITHUB_TOKEN is not set. See backend/.env.example for instructions.');
  process.exit(1);
}

module.exports = config;
