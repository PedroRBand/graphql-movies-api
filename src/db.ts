import mongoose from 'mongoose'
import logger from './utils/logger.js';

const connectDB = async () => {
  logger.info('Connecting to MongoDB...')
  const mongoURI = process.env.MONGO_URI!
  try {
    await mongoose.connect(mongoURI)
    logger.info('MongoDB connected successfully')

  } catch (err) {
    const error = err as Error
    logger.error('MongoDB connection error:', error.message)
    process.exit(1) // Exit process on failure
  }
};

export default connectDB