const express = require("express");
const app = express();
const fetch = require("node-fetch");

app.use(express.json());

let users = [];

// ✅ ROOT (just to confirm server alive)
app.get("/", (req, res) => {
  res.send("🚀 Server Running");
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

// ✅ SEND ALERT TO ALL USERS
app.get("/send-alert", async (req, res) => {

  let message = "🚨 Accident Detected!\nCheck immediately!";

  for (let id of users) {
    await fetch(`https://api.telegram.org/botYOUR_TOKEN/sendMessage?chat_id=${id}&text=${encodeURIComponent(message)}`);
  }

  res.send("Alert Sent");
});

app.listen(3000, () => console.log("Server running on port 3000"));
