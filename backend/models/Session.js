const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  status: { type: String, enum: ["available", "booked", "completed", "canceled"], default: "available" },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentee", default: null},
});

module.exports = mongoose.model("Session", sessionSchema);