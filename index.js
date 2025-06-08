const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_KEY;

console.log("🚀 Server starting...");
console.log("🔑 OpenAI Key set?", !!OPENAI_KEY);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI proxy is running 🚀");
});

app.post("/chat", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "No question provided" });

  try {
    const result = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: question }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = result.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("❌ OpenAI API call error:");
    if (err.response) {
      console.error("Status code:", err.response.status);
      console.error("Response data:", err.response.data);
    } else {
      console.error(err.message);
    }
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
