const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getMongoStatus } = require('./config/db');
const bowserRoutes = require('./routes/bowserRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    component: 'Member 2: Water Bowser & Delivery Management',
    database: getMongoStatus() ? 'MongoDB Connected' : 'In-Memory Fallback Active',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/bowsers', bowserRoutes);
app.use('/api/deliveries', deliveryRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 🚛 WaterWatch Member 2 Server running on port ${PORT}`);
  console.log(` 🌐 Health: http://localhost:${PORT}/api/health`);
  console.log(` 💧 Bowsers API: http://localhost:${PORT}/api/bowsers`);
  console.log(` 📦 Deliveries API: http://localhost:${PORT}/api/deliveries`);
  console.log(`=======================================================`);
});
