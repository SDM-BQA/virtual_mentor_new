const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Mentee = require("../models/Mentee");
const Session = require("../models/Session"); // Import the Session model

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// @route   POST /api/mentees/menteeregister
// @desc    Register a new mentee
router.post(
  "/menteeregister",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const {
        fname,
        lname,
        email,
        mobile,
        gender,
        dob,
        password,
        country,
        state,
        city,
      } = req.body;
      if (!fname || !lname || !email || !password) {
        return res
          .status(400)
          .json({ message: "Please fill in all required fields" });
      } // Check if mentee already exists

      let mentee = await Mentee.findOne({ email });
      if (mentee) {
        return res.status(400).json({ message: "Email already registered" });
      } // Hash password

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt); // Create new mentee

      mentee = new Mentee({
        fname,
        lname,
        email,
        mobile,
        gender,
        dob,
        password: hashedPassword,
        country,
        state,
        city,
        profilePicture: req.file ? req.file.path : "",
      });
      await mentee.save();

      res.status(201).json({ message: "Mentee registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/mentees/:id
// @desc    Get mentee by ID
router.get("/:id", async (req, res) => {
  try {
    const mentee = await Mentee.findById(req.params.id);
    if (!mentee) {
      return res.status(404).json({ message: "Mentee not found" });
    }
    res.json(mentee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/mentees/
// @desc    Get all mentees
router.get("/", async (req, res) => {
  try {
    const mentees = await Mentee.find();
    res.json(mentees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST route to get details of multiple mentees by their IDs
router.post("/details", async (req, res) => {
  try {
    const { menteeIds } = req.body;
    console.log("POST /mentees/details: Received menteeIds:", menteeIds);

    if (!menteeIds || !Array.isArray(menteeIds) || menteeIds.length === 0) {
      return res.status(400).json({ message: "Mentee IDs are required." });
    }

    const mentees = await Mentee.find({ _id: { $in: menteeIds } });

    console.log("POST /mentees/details: Found mentees:", mentees);
    res.status(200).json(mentees);
  } catch (error) {
    console.error(
      "POST /mentees/details: Error fetching mentee details:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/sessions/:id", async (req, res) => {
  try {
    const { menteeId, status } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    } // Validate menteeId (optional, but recommended)

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

// @route   GET /api/mentees/booked-sessions/:menteeId
// @desc    Get all booked sessions for a specific mentee
router.get("/booked-sessions/:menteeId", async (req, res) => {
  try {
    const { menteeId } = req.params; // Find all sessions where the menteeId matches the parameter and the status is 'booked'

    const bookedSessions = await Session.find({
      menteeId,
      status: "booked",
    }).populate("mentorId", "firstName lastName"); // Optionally populate mentor details

    res.status(200).json(bookedSessions);
  } catch (error) {
    console.error("Error fetching booked sessions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
