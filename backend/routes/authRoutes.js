const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Mentor = require("../models/Mentor");
const Mentee = require("../models/Mentee");

const router = express.Router();

// @route  POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt with email: ${email}`);

    // Ensure email is a string and correctly formatted
    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Invalid email format" });
    }

    let user = await Mentor.findOne({ email: String(email) });
    let isMentor = true;

    if (!user) {
      user = await Mentee.findOne({ email: String(email) });
      isMentor = false;
    }

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Incorrect password for email: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), isMentor },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`Login successful for email: ${user.email}`);

    // Construct the full user object to send in the response
    const fullUser = {
      id: user._id.toString(),
      fname: isMentor ? user.firstName : user.fname, // Rename here
      lname: isMentor ? user.lastName : user.lname, // Rename here
      email: user.email,
      isMentor,
      // Add other user properties based on whether it's a Mentor or Mentee
      ...(isMentor
        ? {
            mobile: user.mobile,
            gender: user.gender,
            dob: user.dob,
            country: user.country,
            state: user.state,
            city: user.city,
            mentorIn: user.mentorIn,
            experience: user.experience,
            awards: user.awards,
            instagram: user.instagram,
            linkedin: user.linkedin,
            twitter: user.twitter,
            facebook: user.facebook,
            videoLink: user.videoLink,
            profilePicture: user.profilePicture,
            bio: user.bio,
          }
        : {
            mobile: user.mobile,
            gender: user.gender,
            dob: user.dob,
            country: user.country,
            state: user.state,
            city: user.city,
            profilePicture: user.profilePicture,
            bio: user.bio,
          }),
    };

    res.json({
      token,
      user: fullUser,
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;