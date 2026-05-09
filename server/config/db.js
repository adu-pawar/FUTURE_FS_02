const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Atlas connection failed: ${error.message}`);
    console.log('Falling back to in-memory MongoDB...');
    
    if (process.env.NODE_ENV === 'production') {
      console.error('Critical: MongoDB Atlas connection failed in production. Exiting.');
      process.exit(1);
    }

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log('⚠️  Data will be lost when server restarts.');
    } catch (memError) {
      console.error(`In-memory DB also failed: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
