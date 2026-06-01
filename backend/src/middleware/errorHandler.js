const config = require('../config');

/**
 * Central error-handling middleware.
 * Catches errors thrown from controllers/services and returns
 * a consistent JSON error response.
 */
function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.expose || statusCode < 500 ? err.message : 'Internal server error';

  if (statusCode >= 500) {
    console.error('[ERROR]', err);
  }

  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
