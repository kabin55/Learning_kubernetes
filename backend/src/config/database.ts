import mongoose from 'mongoose';
import dns from 'dns';
import logger from '../utils/logger';

// Workaround for Node.js DNS resolution issues on some Windows machines
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error connecting to DB: ${error.message}`);
    } else {
      logger.error(`Unknown error connecting to DB`);
    }
    process.exit(1);
  }
};
