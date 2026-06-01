const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');
const learningRoutes = require('./routes/learningRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// --------------- Middleware ---------------
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// --------------- Routes ------------------
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/learning', learningRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Error handling ----------
app.use(errorHandler);

// --------------- Start server ------------
app.listen(config.port, () => {
  console.log(`✓ AI System Design Assistant backend running on http://localhost:${config.port}`);
  console.log(`✓ Model: ${config.github.model}`);
  console.log(`✓ Environment: ${config.nodeEnv}`);
});
