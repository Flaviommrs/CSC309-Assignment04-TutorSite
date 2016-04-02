var mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
  roomName: {type: Number, unique: true},
  messages: [{msg:String, sender:String}]

});

var Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;