"use strict";

const PORT = 3000;

import express from "express";
import cors from "cors";
import EasyGPT from "easygpt";
import "dotenv/config.js";
import { createClient } from "@supabase/supabase-js";

import oauth2Client from './googleAuth.js';
const api_key = process.env.CHAT_GPT_API;

const gpt = new EasyGPT();
gpt.setApiKey(api_key);

const app = express();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

app.use(
  cors({
    origin: "https://roadbuddies.onrender.com",
    credentials: true,
  })
);

app.get("/api/groups/:groupid/getPayingUser", async (req, res) => {
  const groupId = req.params.groupid;
  console.log(groupId);

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: true });

  console.log(data);

  if (error) {
    res.status(400).send("Error while retrieving data from the DB: " + error);
  }

  const expensesDictionary = data.reduce(function (res, value) {
    var result = [];
    if (!res[value.user_id]) {
      res[value.user_id] = { user_id: value.user_id, paid: 0 };
      result.push(res[value.user_id]);
    }
    res[value.user_id].paid += value.amount;
    return res;
  }, {});

  const totalExpenses = Object.values(expensesDictionary).sort(
    (a, b) => b.paid - a.paid
  );

  let message =
    "Hi! We are doing a trip and we want to know who will be the user that pays for the next expense. This is the amount that each user spent up to now.\n";

  totalExpenses.forEach((e) => {
    message += `${e.user_id}: ${e.paid} spent\n`;
  });
  if (data.length >= 10) {
    message += "Furthermore, here's the list of the last 10 users that paid.\n";

    const lastTransactions = data.slice(0, 10);

    lastTransactions.forEach((t) => {
      message += `${t.user_id}\n`;
    });
  } else {
    message += `Furthermore, here's the list of the last ${data.length} users that paid.\n`;

    data.forEach((t) => {
      message += `${t.user_id}\n`;
    });
  }

  gpt.addMessage(message);

  gpt.addRule(
    "Make a fair decision. On average, all the users should spend the same amount, so you shold pick users who spent less. Explain your decision in 1/2 sentencs and clearly write the mail of the usr that must pay."
  );

  const response = await gpt.ask();

  res.json({ user: response.content });
});
//Google Docs stuff
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
  res.redirect(authUrl);
});
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query; // Get the authorization code from the query string

  if (code) {
    try {
      // Exchange the code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Now you can use these tokens to access Google services
      // You might want to store them for later use

      // Redirect the user or send a response
      res.redirect('http://localhost:5173/')
    } catch (error) {
      console.error('Error exchanging code for tokens', error);
      res.status(500).send('Authentication error');
    }
  } else {
    res.status(400).send('Invalid request, authorization code is missing');
  }
});
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
