import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  isAdmin: Boolean,
  email: { type: String, unique: true },
  defaultAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
});

const User = mongoose.model('User', userSchema);

export default User;
