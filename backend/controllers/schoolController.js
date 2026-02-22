const School = require("../models/School");

// Get school details by schoolID (for parent dashboard)
const getSchoolByID = async (req, res) => {
  try {
    const { schoolID } = req.params;
    const school = await School.findOne({ schoolID }).select("schoolName schoolID busNumber");

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json({
      schoolID: school.schoolID,
      schoolName: school.schoolName,
      busNumber: school.busNumber,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSchoolByID };
