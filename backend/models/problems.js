const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const problemSchema = new Schema({
  contestId: {
    type: Number,
    required: true,
  },
  index: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    // required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
});

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
