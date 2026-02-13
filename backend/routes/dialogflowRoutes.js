const express = require("express");
const router = express.Router();
const dialogflow = require("@google-cloud/dialogflow");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Absolute path to JSON key
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: path.join(__dirname, "../dialogflow-key.json"),
});

router.post("/chat", async (req, res) => {
  try {
    const sessionId = uuidv4();
    const { message } = req.body;

    const sessionPath = sessionClient.projectAgentSessionPath(
      "trustbusagent-i9np",
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: "en-US",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({ reply: result.fulfillmentText || "No response from bot." });
  } catch (error) {
    console.error("❌ Dialogflow error:", error);
    res.status(500).json({ error: "Dialogflow failed" });
  }
});

module.exports = router;
