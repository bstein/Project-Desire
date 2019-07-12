import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  isAdmin: Boolean,
  name: String,
  email: String,
  googleID: { type: String, unqiue: true },
  defaultAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
});

const User = mongoose.model('User', userSchema);

export default User;
