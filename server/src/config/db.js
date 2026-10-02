const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/opsmind';
    
    // Attempt standard connection first
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (localErr) {
      if (!mongoServer) {
        console.log('Local MongoDB not reachable. Initializing in-memory MongoDB fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
      }
      const inMemoryUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`In-Memory MongoDB Connected: ${inMemoryUri}`);
      return conn;
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};


module.exports = connectDB;
