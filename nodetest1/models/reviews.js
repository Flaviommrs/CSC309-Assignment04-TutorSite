var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
  reviewee : {type: String, required: true},
  reviewer : {type: String, required: true},
  likes : Number,
  rating : Number,
  commented : String
});

var Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
