const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const Review = require("../models/Review");

router.post("/submit-review", async (req, res) => {
  try {
    const { ticketNumber, rating, username, email, busRoute } = req.body;

    // 🔍 Check ticket exists
    const ticket = await Ticket.findOne({ ticketId: ticketNumber });

    if (!ticket) {
      return res.status(400).json({ message: "Invalid Ticket Number" });
    }

    // 🔒 Check if already used
    if (ticket.isUsed) {
      return res.status(400).json({ message: "Ticket already used" });
    }

    // ✅ Create review with correct field mapping
    await Review.create({
      ticketId: ticketNumber,   // <-- IMPORTANT FIX
      rating,
      username,
      email,
      busRoute
    });

    // 🔄 Mark ticket as used
    ticket.isUsed = true;
    await ticket.save();

    res.status(200).json({ message: "Review submitted successfully" });

  } catch (err) {
    console.error("ROUTE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;