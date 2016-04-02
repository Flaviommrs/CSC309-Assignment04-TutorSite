var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
  roomName: Number,
  messages: [String]

});

var Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
