const express = require("express")
const router = express.Router()
const { submitDriverRating } = require("../controllers/driverRatingController")

router.post("/", submitDriverRating)

module.exports = router
