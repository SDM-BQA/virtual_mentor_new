const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Mentor = require("../models/Mentor");
const dotenv = require("dotenv");
const Session = require("../models/Session"); // Import the Session model
console.log("mentors.js: Starting execution");
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

// GET sessions for a specific mentor
router.get("/sessions", async (req, res) => {
  try {
    console.log("GET /sessions: Request received");
    console.log("GET /sessions: req.query:", req.query);
    const { mentorId, status } = req.query;
    console.log("GET /sessions: mentorId from query:", mentorId);
    console.log("GET /sessions: status from query:", status);
    const filter = {};

    if (mentorId) {
      filter.mentorId = mentorId;
      console.log("GET /sessions: Filter with mentorId:", filter);
    }

    if (status) {
      filter.status = status;
      console.log("GET /sessions: Filter with status:", filter);
    }

    const sessions = await Session.find(filter).sort({ date: 1 }); // Sort by date
    console.log("GET /sessions: Found sessions:", sessions);
    res.status(200).json(sessions);
  } catch (error) {
    console.error("GET /sessions: Error fetching sessions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

// Create Session Route
router.post("/sessions", async (req, res) => {
  try {
    console.log("POST /sessions: Request body received:", req.body);

    const { mentorId, date, duration, status } = req.body;

    // Enhanced Validation
    if (!mentorId || !date || !duration || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({ message: "Invalid duration. Must be a positive number." });
    }

    const sessionDate = new Date(date);
    if (isNaN(sessionDate.getTime()) || sessionDate < new Date()) {
      return res.status(400).json({ message: "Invalid session date. Must be a future date." });
    }

    // Fixing status validation
    const validStatuses = ["available", "booked", "completed", "canceled"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const newSession = new Session({
      mentorId,
      date: sessionDate,
      duration,
      status: status.toLowerCase(),
    });

    const savedSession = await newSession.save();
    console.log("POST /sessions: Session saved to database:", savedSession);

    res.status(201).json({ message: "Session created successfully", session: savedSession });
  } catch (error) {
    console.error("POST /sessions: Error saving session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT route to update a session (e.g., to book it)
router.put("/sessions/:id", async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { menteeId, status } = req.body;

    console.log(`PUT /sessions/${sessionId}: Request body received:`, req.body);

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Validate status update
    const validStatuses = ["available", "booked", "completed", "canceled"];
    if (status && !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    // If booking, ensure the session is currently available
    if (status && status.toLowerCase() === "booked" && session.status !== "available") {
      return res.status(400).json({ message: "Session is not currently available for booking." });
    }

    // Update menteeId if provided
    if (menteeId) {
      // Basic validation for menteeId (you might want more robust validation)
      const Mentee = require("../models/Mentee"); // Import Mentee model here to avoid circular dependency
      const mentee = await Mentee.findById(menteeId);
      if (!mentee) {
        return res.status(400).json({ message: "Invalid mentee ID." });
      }
      session.menteeId = menteeId;
    }

    // Update status if provided
    if (status) {
      session.status = status.toLowerCase();
    }

    const updatedSession = await session.save();
    console.log(`PUT /sessions/${sessionId}: Session updated successfully:`, updatedSession);

    res.status(200).json({ message: "Session updated successfully", session: updatedSession });
  } catch (error) {
    console.error(`PUT /sessions/:id: Error updating session:`, error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;