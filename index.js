const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAIKEY = process.env.OPENAIKEY;

if (!OPENAIKEY) {
  console.error("ERROR: OPENAIKEY is not set in environment variables");
  process.exit(1);
}

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { question } = req.body;
  console.log("→ Incoming question:", question);

  if (!question) {
    console.log("❌ No question provided in body:", req.body);
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      { model: "gpt-4o-mini", messages: [{ role: "user", content: question }] },
      {
        headers: {
          Authorization: `Bearer ${OPENAIKEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );
    console.log("✅ OpenAI API success:", response.data.choices[0].message.content);
    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("❌ OpenAI API failed:");
    if (err.response) {
      console.error("→ Status:", err.response.status);
      console.error("→ Data:", err.response.data);
    } else {
      console.error("→ Error message:", err.message);
    }
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
