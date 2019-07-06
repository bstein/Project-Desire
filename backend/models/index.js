import mongoose from 'mongoose';
import Address from './address';
import User from './user';

// Avoid using deprecated ensureIndex by using useCreateIndex instead
mongoose.set('useCreateIndex', true);

// Handle any errors when attempting to connect to the database
mongoose.connection.on('error', (err) => {
  console.error(`Failed to connect to MongoDB server | ${err}`);
});

const connectMon = () => mongoose.connect(process.env.DB_URI);
const models = { Address, User };

export { connectMon };
export default models;
