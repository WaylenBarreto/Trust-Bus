const express = require("express")
const router = express.Router()
const { spawn } = require("child_process")
const path = require("path")

// ⭐ Start HyperMovement AI
router.get("/start-hypermovement", (req, res) => {
  try {
    const scriptPath = path.join(__dirname, "..", "ai", "hypermovement.py")

    console.log("🚀 Starting HyperMovement AI...")
    console.log("Script path:", scriptPath)

    const pythonProcess = spawn(
      "C:\\Users\\shere\\AppData\\Local\\Programs\\Python\\Python311\\python.exe",
      [scriptPath],
      { shell: true }
    )

    pythonProcess.stdout.on("data", (data) => {
      console.log(`HYPER AI: ${data}`)
    })

    pythonProcess.stderr.on("data", (data) => {
      console.error(`HYPER ERROR: ${data}`)
    })

    pythonProcess.on("close", (code) => {
      console.log(`HyperMovement exited with code ${code}`)
    })

    res.json({ message: "HyperMovement started" })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to start HyperMovement" })
  }
})

module.exports = router
