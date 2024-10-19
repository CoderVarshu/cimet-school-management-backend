import { connect } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const connectDB = async () => {
  const mongoURI =  process.env.MONGO_URI_TEST;

  try {
    await connect(mongoURI);
    console.log(`MongoDB connected successfully`);
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
};

export default connectDB;
