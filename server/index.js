"use strict";

const PORT = 3000;

import express from "express";
import cors from "cors";
import EasyGPT from "easygpt";
import "dotenv/config.js";
import { createClient } from "@supabase/supabase-js";

// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   organization: "org-lsdStcKCOZFM8VU81b5YacFe",
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

// dotenv.config();

const api_key = process.env.CHAT_GPT_API;

const gpt = new EasyGPT();
gpt.setApiKey(api_key);

const app = express();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

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
    "Make a fair decision based both on the total amount spent (weight: 75%, users who spent less will pay with an higher probability) and the last payments (weight: 25%, users that made many payments pay with a lower probability). Add an explanation. Be concise, so write at most 2/3 sentences and include in the motivations the numbers provided in the question."
  );

  const response = await gpt.ask();

  res.json({ user: response.content });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
