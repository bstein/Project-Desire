import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  isAdmin: { type: Boolean, default: false },
  name: String,
  email: String,
  pictureURL: String,
  userID: { type: String, unqiue: true },
  defaultAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
});

const User = mongoose.model('User', userSchema);

export default User;
