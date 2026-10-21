const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB with timeout protection and status tracking
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mrsm_store';

  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500 // Don't block requests indefinitely if DB offline
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Notice: Could not connect to MongoDB at "${uri}".`);
    console.warn(`[MongoDB] Detail: ${error.message}`);
    console.warn(`[MongoDB] To connect your database, set MONGODB_URI in backend/.env`);
    return null;
  }
};

mongoose.connection.on('connected', () => {
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error(`[MongoDB] Connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB] Disconnected from database.');
});

const isDatabaseConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

module.exports = {
  connectDB,
  isDatabaseConnected
};
