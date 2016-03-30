var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tutor: Boolean,
  admin: Boolean,
  picture: String,//BinData, did not work for some reason - THIS WILL BE CHANGED! PICTURE IS NOT A STRING!
  location: {
      country: String,
      city: String,
      zipcode: String
  },
  subjects: [String],
  freeTimes: String,
  events: String,
  fbID: { type: String, unique: true }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
