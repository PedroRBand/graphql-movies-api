var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import logger from './utils/logger.js';
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('Connecting to MongoDB...');
    const mongoURI = process.env.MONGO_URI;
    try {
        yield mongoose.connect(mongoURI);
        logger.info('MongoDB connected successfully');
    }
    catch (err) {
        const error = err;
        logger.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit process on failure
    }
});
export default connectDB;
