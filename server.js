const express = require("express");

const app = express();
app.use(express.json());

const TOKEN = "8616202899:AAGQTd1xWfTMxHQLDfBLLruVtJtyDdn2t2c";

let users = []; // store chat_ids

// 🔥 Webhook (auto store users)
app.post("/webhook", async (req, res) => {

  let msg = req.body.message;

  if (msg && msg.chat) {

    let chat_id = msg.chat.id;

    if (!users.includes(chat_id)) {
      users.push(chat_id);
      console.log("New user:", chat_id);
    }

    // send reply
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chat_id}&text=✅ Registered for alerts`);

  }

  res.send("OK");
});


// 🚨 ALERT API
app.get("/alert", async (req, res) => {

  let lat = req.query.lat;
  let lon = req.query.lon;

  let message = `🚨 ALERT
Accident detected
Location: https://maps.google.com/?q=${lat},${lon}`;

  for (let id of users) {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${id}&text=${encodeURIComponent(message)}`);
  }

  res.send("Alert sent");
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});