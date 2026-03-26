const express = require("express");
const app = express();

app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;

let users = [];

// ROOT
app.get("/", (req, res) => {
  res.send("🚀 Server Running");
});

// TEST
app.get("/test", (req, res) => {
  res.send("TEST OK");
});

// WEBHOOK
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

// USERS
app.get("/users", (req, res) => {
  res.json(users);
});

// ALERT
app.get("/alert", async (req, res) => {
  try {
    let lat = req.query.lat || "0";
    let lon = req.query.lon || "0";

    let message = `🚨 ALERT\nLocation: https://maps.google.com/?q=${lat},${lon}`;

    if (users.length === 0) {
      return res.send("❌ No users found. Send /start to bot first.");
    }

    for (let id of users) {
      let url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${id}&text=${encodeURIComponent(message)}`;

      console.log("➡ Sending to:", id);

      let response = await fetch(url);
      let data = await response.json();

      // 🔥 IMPORTANT DEBUG
      console.log("📩 Telegram response:", data);

      if (!data.ok) {
        console.log("❌ ERROR:", data.description);
      }
    }

    res.send("✅ Alert sent");
  } catch (err) {
    console.log("❌ SERVER ERROR:", err);
    res.status(500).send("Error");
  }
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));