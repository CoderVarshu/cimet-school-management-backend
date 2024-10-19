// tests/db.test.js
import { config } from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './db';

config();

describe('Database Connection', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should connect to MongoDB successfully', async () => {
    const state = mongoose.connection.readyState;
    expect(state).toBe(1);
  });
});
