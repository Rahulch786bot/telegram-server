const express = require("express");
const app = express();

// 🔥 Node 18+ → fetch already built-in (no need node-fetch)
// If error na uncomment next line:
// const fetch = require("node-fetch");

app.use(express.json());

// ✅ Use ENV for token (IMPORTANT)
const TOKEN = process.env.BOT_TOKEN;

let users = [];

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("🚀 Server Running");
});

// ✅ TEST ROUTE (debug)
app.get("/test", (req, res) => {
  res.send("TEST OK");
});

// ✅ TELEGRAM WEBHOOK
app.post("/webhook", (req, res) => {
  console.log("🔥 DATA RECEIVED:", JSON.stringify(req.body));

  let msg = req.body.message;

  if (msg) {
    let chat_id = msg.chat.id;

    if (!users.includes(chat_id)) {
      users.push(chat_id);
      console.log("✅ New user:", chat_id);
    }
  }

  res.sendStatus(200);
});

// ✅ CHECK USERS (debug)
app.get("/users", (req, res) => {
  res.json(users);
});

// ✅ SEND ALERT
app.get("/alert", async (req, res) => {
  try {
    let lat = req.query.lat || "0";
    let lon = req.query.lon || "0";

    let message = `🚨 ALERT\nLocation: https://maps.google.com/?q=${lat},${lon}`;

    console.log("📢 Users:", users);

    if (users.length === 0) {
      return res.send("❌ No users found. Send /start to bot first.");
    }

    for (let id of users) {
      console.log("➡ Sending to:", id);

      let url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${id}&text=${encodeURIComponent(message)}`;

      let response = await fetch(url);
      let data = await response.json();

      console.log("📩 Telegram response:", data);
    }

    res.send("✅ Alert sent");
  } catch (error) {
    console.log("❌ ERROR:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ PORT FIX (RENDER IMPORTANT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));