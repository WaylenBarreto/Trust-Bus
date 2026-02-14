const DriverRating = require("../models/DriverRating")

const submitDriverRating = async (req, res) => {
  try {
    const { username, email, ticketNumber, rating, busRoute } = req.body

    const newRating = await DriverRating.create({
      username,
      email,
      ticketNumber,
      rating,
      busRoute
    })

    res.status(201).json({ message: "Rating submitted", newRating })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { submitDriverRating }
