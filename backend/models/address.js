import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  addressName: String,
  isPublic: { type: Boolean, default: true },
  isSaved: { type: Boolean, default: true },
  name: String,
  company: String,
  street1: String,
  street2: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  residential: Boolean,
  phone: String,
  email: String,
  easyPostID: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Address = mongoose.model('Address', addressSchema);

export default Address;
