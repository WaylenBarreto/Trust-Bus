const express = require("express");
const router = express.Router();
const { getSchoolByID } = require("../controllers/schoolController");

// GET /api/school/:schoolID - Fetch school details by school ID (for parent dashboard)
router.get("/:schoolID", getSchoolByID);

module.exports = router;
