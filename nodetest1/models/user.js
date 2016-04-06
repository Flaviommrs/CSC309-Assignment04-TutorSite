var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tutor: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  picture: String,//BinData, did not work for some reason - THIS WILL BE CHANGED! PICTURE IS NOT A STRING!
  //location: {
      country: { type: String, default: "" },
      city: { type: String, default: "" },
      zipcode: { type: String, default: "" },
  //},
  subjects: [String],
  events: { type: String, default: "" },
  fbID: { type: String, unique: false },
  chats: [{room: Number, user: String}], //CHECK THIS
  occupation: { type: String, default: "" },
  education: { type: String, default: "" },
  experience: { type: String, default: "" },
  about: { type: String, default: "" },
  phone: { type: String, default: "" },
  rate: { type: Number, default: 40 },
  sum_rating: { type: Number, default: 0 },
  rating_count: { type: Number, default: 1 }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
