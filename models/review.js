const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  //   username: String,
});

module.exports = mongoose.model("Review", reviewSchema);
