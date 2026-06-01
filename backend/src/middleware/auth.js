const jwt = require('jsonwebtoken');
const config = require('../config');
const store = require('../services/inMemoryStore');

/**
 * JWT authentication middleware.
 * Verifies the Bearer token and attaches `req.user` on success.
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid token' });
  }

  const token = header.slice(7);
  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    return res.status(401).json({ success: false, error: 'Token expired or invalid' });
  }

  const user = store.findById(payload.sub);
  if (!user) {
    return res.status(401).json({ success: false, error: 'User not found' });
  }

  req.user = { id: user.id, name: user.name, email: user.email };
  next();
}

module.exports = { authenticate };
