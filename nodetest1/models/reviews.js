var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
  reviewee = {type: String, required: true},
  reviews = [{
    reviewer = String,
    likes = Number,
    Rating = Number,
    commented = String
  }]
});

var Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
