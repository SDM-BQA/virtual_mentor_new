const mongoose = require("mongoose");

const MenteeSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    profilePicture: { type: String },
  },
  { collection: "mentees" } // Explicitly setting collection name
);

module.exports = mongoose.model("Mentee", MenteeSchema);
