import mongoose from 'mongoose';

export let isInMemory = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/waterwatch';
  
  try {
    // Attempt standard connection with 1s timeout
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 1200,
    });
    console.log(`[Database] Connected to MongoDB at ${mongoURI}`);
    isInMemory = false;
  } catch (err) {
    console.log(`[Database] Local MongoDB not detected. Activating instant lightweight Memory Repository...`);
    isInMemory = true;
  }
};
