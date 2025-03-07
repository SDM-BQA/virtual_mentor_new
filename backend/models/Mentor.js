const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  mentorIn: { type: String, required: true },
  experience: { type: Number, required: true },
  awards: { type: String },
  socialLinks: {
    instagram: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String }
  },
  videoLink: { type: String },
  profilePicture: { type: String },
  bio: { type: String },
  
});

module.exports = mongoose.model("Mentor", MentorSchema);
