const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const store = require('../services/inMemoryStore');

const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });
}

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = store.createUser({ name, email, password: hashed });

    if (!user) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    const token = signToken(user);
    return res.status(201).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'email and password are required' });
    }

    const user = store.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({
      success: true,
      data: { user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }, token },
    });
  } catch (err) {
    next(err);
  }
}

function me(req, res) {
  return res.json({ success: true, data: { user: req.user } });
}

module.exports = { signup, login, me };
