const express = require("express");
const router = express.Router();
const dialogflow = require("@google-cloud/dialogflow");
const { v4: uuidv4 } = require("uuid");

// ---------- PARENT CHATBOT ----------
router.post("/parent", async (req, res) => {
  try {
    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: "./parent-key.json",
    });

    const sessionPath = sessionClient.projectAgentSessionPath(
      "trustbusparent-swpe",
      uuidv4()
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body.message,
          languageCode: "en",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({ reply: result.fulfillmentText || "No response" });

  } catch (error) {
    console.error("❌ Parent Dialogflow error:", error);
    res.status(500).json({ reply: "Parent chatbot failed" });
  }
});


// ---------- PUBLIC CHATBOT ----------
router.post("/public", async (req, res) => {
  try {
    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: "./public-key.json",
    });

    const sessionPath = sessionClient.projectAgentSessionPath(
      "trustbusagent-i9np",
      uuidv4()
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: req.body.message,
          languageCode: "en",
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({ reply: result.fulfillmentText || "No response" });

  } catch (error) {
    console.error("❌ Public Dialogflow error:", error);
    res.status(500).json({ reply: "Public chatbot failed" });
  }
});

module.exports = router;
