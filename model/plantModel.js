const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Plant = new Schema({
  plantDescription: {
    type: String,
    required: true,
  },
  dateWatered: {
    type: String,
    required: true,
  },
  waterFrequency: {
    type: Number,
    required: true,
  },
  plantPriority: {
    type: Number,
    required: true,
  },
  plantImage: {
    type: mongoose.Mixed,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Plant", Plant);
