const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const { connectDB, getDBMode } = require('./config/db');

// Route handlers
const priorityRoutes = require('./routes/priorityRoutes');
const aiRoutes = require('./routes/aiRoutes');
const bowserRoutes = require('./routes/bowserRoutes');
const demoRoutes = require('./routes/demoRoutes');
const { getResidentFeed } = require('./controllers/bowserController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/priorities', priorityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/bowsers', bowserRoutes);
app.use('/api/demo', demoRoutes);

// Direct shortcut for prompt-specified resident notification route
app.get('/api/notifications/resident-feed', getResidentFeed);

// Root & System Info Endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    project: 'WaterWatch Polonnaruwa',
    component: 'Functional Component 4: Smart Water Priority & Next-Bowser Recommendation Engine',
    teamMember: 'Member 4 (AI Decision Support)',
    dbMode: getDBMode(),
    endpoints: [
      'GET  /api/priorities',
      'GET  /api/priorities/:villageId',
      'GET  /api/ai/recommendation',
      'POST /api/ai/explanation',
      'GET  /api/ai/health',
      'GET  /api/bowsers',
      'POST /api/bowsers/dispatch',
      'GET  /api/notifications/resident-feed',
      'POST /api/demo/reset',
      'POST /api/demo/update-shortage'
    ]
  });
});

// Serve built client frontend if available
const clientDistPath = path.join(__dirname, '../client/dist');
const fs = require('fs');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
async function startServer() {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`💧 WaterWatch Polonnaruwa Engine running on port ${PORT}`);
    console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
    console.log(`🤖 AI Endpoint: http://localhost:${PORT}/api/ai/recommendation`);
    console.log(`=======================================================`);
  });
  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
