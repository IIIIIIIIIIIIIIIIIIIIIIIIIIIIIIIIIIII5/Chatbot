const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_KEY;

app.use(cors());
app.use(express.json());

console.log("🔑 OpenAI Key loaded?", !!OPENAI_KEY);

app.get("/", (req, res) => {
  res.send("AI proxy is running 🚀");
});

console.log("🔑 OpenAI Key loaded?", !!OPENAI_KEY);

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
          "Authorization": `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const reply = result.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
  console.error("❌ OpenAI API Error");
  console.error("Status:", err.response?.status);
  console.error("Data:", err.response?.data);
  res.status(500).json({ error: "AI request failed" });
}
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
