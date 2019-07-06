import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  locationName: String,
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
  _easyPostID: String,
});

const Address = mongoose.model('Address', addressSchema);

export default Address;
