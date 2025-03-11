const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Mentor = require("../models/Mentor");
const Session = require("../models/Session");
const Mentee = require("../models/Mentee"); // Import Mentee model
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
router.post(
  "/mentorregister",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        mobile,
        gender,
        dob,
        country,
        state,
        city,
        password,
        mentorIn,
        experience,
        awards,
        socialLinks,
        videoLink,
        bio,
      } = req.body;

      // Check if email already exists
      const existingMentor = await Mentor.findOne({ email });
      if (existingMentor)
        return res.status(400).json({ message: "Email already registered" });

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

      res
        .status(201)
        .json({ message: "Mentor registered successfully", token });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
);

// Mentor Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if mentor exists
    const mentor = await Mentor.findOne({ email });
    if (!mentor)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT Token
    const token = jwt.sign(
      { mentorId: mentor._id, email: mentor.email, isMentor: mentor.isMentor },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, isMentor: mentor.isMentor });
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

// Create Session Route
// router.post("/sessions", async (req, res) => {
//   try {
//     const { mentorId, date, duration, status } = req.body;
//     const newSession = new Session({
//       mentorId,
//       date,
//       duration,
//       status,
//     });
//     await newSession.save();
//     res.status(201).json({ message: "Session created successfully" });
//   } catch (error) {
//     console.error("Error creating session:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// Create Session Route
router.post("/sessions", async (req, res) => {
  try {
    const { mentorId, date, duration, status } = req.body;

    // Basic input validation (optional, but recommended)
    if (!mentorId || !date || !duration || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert duration to a number (if it's not already)
    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      return res.status(400).json({ message: "Invalid duration" });
    }

    const newSession = new Session({
      mentorId,
      date,
      duration: durationNum,
      status,
    });

    await newSession.save();
    res.status(201).json({ message: "Session created successfully", session: newSession }); // Include the created session in the response

  } catch (error) {
    console.error("Error creating session:", error);

    // Handle specific error types (e.g., database errors)
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }

    res.status(500).json({ message: "Internal server error", error: error.message }); // Send error message to client
  }
});

// // Get Mentor's Sessions Route
// router.get("/:mentorId/sessions", async (req, res) => {
//   try {
//     const mentorId = req.params.mentorId;
//     const sessions = await Session.find({ mentorId: mentorId });
//     res.status(200).json(sessions);
//   } catch (error) {
//     console.error("Error getting sessions:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get("/sessions", async (req, res) => {
  try {
    const mentorId = req.query.mentorId;
    const status = req.query.status;
    let query = {};

    if (mentorId) {
        query.mentorId = mentorId;
    }

    if (status){
        query.status = status;
    }

    const sessions = await Session.find(query);
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error getting sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Session Route (for booking)
router.put("/sessions/:id", async (req, res) => {
  try {
    const { menteeId, status } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Validate menteeId (optional, but recommended)
    if (menteeId) {
      const mentee = await Mentee.findById(menteeId);
      if (!mentee) {
        return res.status(400).json({ message: "Invalid mentee ID" });
      }
    }

    session.menteeId = menteeId;
    session.status = status;
    await session.save();

    res.json({ message: "Session updated successfully", session });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;