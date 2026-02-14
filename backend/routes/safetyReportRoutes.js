const express = require("express")
const router = express.Router()

const { createSafetyReport } = require("../controllers/safetyReportController")

router.post("/", createSafetyReport)

module.exports = router
