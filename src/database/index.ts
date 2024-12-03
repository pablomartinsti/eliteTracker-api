import mongoose from 'mongoose';

export async function setupMongo() {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    console.log('🌐 Connecting to database...');
    await mongoose.connect('mongodb://localhost:27017/elitetracker', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ Database Connected!');
  } catch {
    throw new Error('❌ Database not connected.');
  }
}
