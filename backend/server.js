import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isInMemory } from './config/db.js';
import tankRoutes from './routes/tankRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import Tank from './models/Tank.js';
import { seedDatabase } from './utils/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tanks', tankRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'WaterWatch Tank Monitoring API is running smoothly', time: new Date() });
});

// Start Server
const startServer = async () => {
  await connectDB();
  
  // Auto-seed if database is empty and connected to standard Mongo
  if (!isInMemory) {
    try {
      const tankCount = await Tank.countDocuments();
      if (tankCount === 0) {
        console.log('[Server] No tanks found in DB. Seeding initial Polonnaruwa dataset...');
        await seedDatabase();
      }
    } catch (err) {
      console.error('[Server] Initial seed check error:', err);
    }
  }

  app.listen(PORT, () => {
    console.log(`[Server] WaterWatch API Server listening on http://localhost:${PORT}`);
  });
};

startServer();
