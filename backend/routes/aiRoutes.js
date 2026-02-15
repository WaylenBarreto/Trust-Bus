const express = require("express")
const router = express.Router()
const { spawn } = require("child_process")
const path = require("path")

let hyperProcess = null
let emotionProcess = null
let blurProcess = null

const PYTHON = "C:\\Users\\shere\\AppData\\Local\\Programs\\Python\\Python311\\python.exe"

const { exec } = require("child_process")

function stopProcess(proc) {
  if (!proc) return

  try {
    exec(`taskkill /PID ${proc.pid} /T /F`)
  } catch (err) {
    console.log("Failed to kill process tree")
  }
}


////////////////////////////////////////////////////////
// START HYPERMOVEMENT
////////////////////////////////////////////////////////
router.get("/start-hypermovement", (req, res) => {
  try {
    // ⭐ STOP EMOTION FIRST (camera conflict fix)
    stopProcess(emotionProcess)

    if (hyperProcess) {
      return res.json({ message: "HyperMovement already running" })
    }

    const scriptPath = path.join(__dirname, "..", "ai", "hypermovement.py")
    console.log("🚀 Starting HyperMovement AI...")

    hyperProcess = spawn(PYTHON, [scriptPath], { shell: true })

    hyperProcess.stdout.on("data", data => console.log(`HYPER: ${data}`))
    hyperProcess.stderr.on("data", data => console.log(`HYPER ERR: ${data}`))

    hyperProcess.on("close", () => {
      console.log("HyperMovement stopped")
      hyperProcess = null
    })

    res.json({ message: "HyperMovement started" })

  } catch (err) {
    res.status(500).json({ message: "Failed to start HyperMovement" })
  }
})

////////////////////////////////////////////////////////
// START EMOTION
////////////////////////////////////////////////////////
router.get("/start-emotion", (req, res) => {
  try {
    // ⭐ STOP HYPER FIRST (camera conflict fix)
    stopProcess(hyperProcess)

    if (emotionProcess) {
      return res.json({ message: "Emotion already running" })
    }

    const scriptPath = path.join(__dirname, "..", "ai", "emotion.py")
    console.log("😊 Starting Emotion AI...")

    emotionProcess = spawn(PYTHON, [scriptPath], { shell: true })

    emotionProcess.stdout.on("data", data => console.log(`EMOTION: ${data}`))
    emotionProcess.stderr.on("data", data => console.log(`EMOTION ERR: ${data}`))

    emotionProcess.on("close", () => {
      console.log("Emotion stopped")
      emotionProcess = null
    })

    res.json({ message: "Emotion started" })

  } catch (err) {
    res.status(500).json({ message: "Failed to start Emotion" })
  }
})
////////////////////////////////////////////////////////
// START BLUR AI
////////////////////////////////////////////////////////
router.get("/start-blur", (req, res) => {
  try {
    stopProcess(hyperProcess)
    stopProcess(emotionProcess)

    if (blurProcess) {
      return res.json({ message: "Blur AI already running" })
    }

    const scriptPath = path.join(__dirname, "..", "ai", "aiCameraServer.py")
    console.log("🟢 Starting Blur AI...")

    blurProcess = spawn(PYTHON, [scriptPath], { shell: true })

    blurProcess.stdout.on("data", data => console.log(`BLUR: ${data}`))
    blurProcess.stderr.on("data", data => console.log(`BLUR ERR: ${data}`))

    blurProcess.on("close", () => {
      console.log("Blur AI stopped")
      blurProcess = null
    })

    res.json({ message: "Blur AI started" })

  } catch {
    res.status(500).json({ message: "Failed to start Blur AI" })
  }
})

////////////////////////////////////////////////////////
// ⭐ STOP ALL AI (MOST IMPORTANT ROUTE)
////////////////////////////////////////////////////////
router.get("/stop-ai", (req, res) => {
  stopProcess(hyperProcess)
  stopProcess(emotionProcess)
  stopProcess(blurProcess)

  // ⭐ THIS WAS MISSING (VERY IMPORTANT)
  hyperProcess = null
  emotionProcess = null
  blurProcess = null

  console.log("🛑 All AI stopped")
  res.json({ message: "All AI stopped" })
})
////////////////////////////////////////////////////////
// ⭐ PROXY BLUR STREAM (React → Node → Python)
////////////////////////////////////////////////////////
const http = require("http")

router.get("/blur-stream", (req, res) => {
  console.log("📡 Proxying blur stream...")

  const options = {
    hostname: "127.0.0.1",
    port: 5001,
    path: "/ai-camera",
    method: "GET",
  }

  const proxy = http.request(options, function (r) {
    res.writeHead(r.statusCode, r.headers)
    r.pipe(res, { end: true })
  })

  proxy.on("error", function (err) {
    console.log("❌ Blur proxy error:", err.message)
    res.status(500).send("Blur AI not running")
  })

  proxy.end()
})

module.exports = router
