const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Mentor = require("../models/Mentor");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Configure Multer for profile picture uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET;

// Mentor Registration Route
router.post("/mentorregister", upload.single("profilePicture"), async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, gender, dob, country, state, city, password, mentorIn, experience, awards, socialLinks, videoLink, bio } = req.body;

    // Check if email already exists
    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new mentor
    const newMentor = new Mentor({
      firstName,
      lastName,
      email,
      mobile,
      gender,
      dob,
      country,
      state,
      city,
      password: hashedPassword,
      mentorIn,
      experience,
      awards,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : [],
      videoLink,
      profilePicture: req.file ? req.file.path : null,
      bio,
    });

    // Save mentor to DB
    await newMentor.save();

    // Generate JWT Token
    const token = jwt.sign(
      { mentorId: newMentor._id, email: newMentor.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ message: "Mentor registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Mentor Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if mentor exists
    const mentor = await Mentor.findOne({ email });
    if (!mentor) return res.status(400).json({ message: "Invalid email or password" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT Token
    const token = jwt.sign(
      { mentorId: mentor._id, email: mentor.email, isMentor: mentor.isMentor },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", token, isMentor: mentor.isMentor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// GET all mentors
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET mentor by ID
router.get("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.json(mentor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to Verify Token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.mentor = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = router;