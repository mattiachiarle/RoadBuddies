"use strict";

const PORT = 3000;

import express from "express";
import cors from "cors";
import EasyGPT from "easygpt";
import "dotenv/config.js";
import { createClient } from "@supabase/supabase-js";
import querystring from "querystring";
import request from "request";

import oauth2Client from "./googleAuth.js";
const api_key = process.env.CHAT_GPT_API;
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
console.log(spotify_client_secret);
const redirect_url = "https://roadbuddies-backend.onrender.com/api/callback";
// const redirect_url = "http://localhost:3000/api/callback";

const gpt = new EasyGPT();
gpt.setApiKey(api_key);

const app = express();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

app.use(
  cors({
    origin: [
      "https://roadbuddies.onrender.com",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://accounts.spotify.com",
    ],
    credentials: true,
  })
);

app.get("/api/spotifyLogin", function (req, res) {
  var state = generateRandomString(16);
  var scope =
    "user-read-private user-read-email playlist-modify-public playlist-modify-private";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: redirect_url,
        state: state,
      })
  );
});

app.get("/api/callback", async (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_url,
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
        Authorization:
          "Basic " +
          new Buffer.from(
            spotify_client_id + ":" + spotify_client_secret
          ).toString("base64"),
      },
      json: true,
    };
    // console.log(authOptions);
    // fetch(authOptions.url, authOptions)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // Handle the response, which contains the access token
    //     console.log(data);
    //     res.json({
    //       acces_token: data.access_token,
    //       refresh_token: data.refresh_token,
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     res.send("Error obtaining access token");
    //   });
    request.post(authOptions, function (error, response, body) {
      console.log(body);
      var access_token = body.access_token;
      var refresh_token = body.refresh_token;
      // let uri = "http://localhost:5173";
      let uri = "https://roadbuddies.onrender.com";
      res.redirect(
        uri +
          "?spotify_access_token=" +
          access_token +
          "&spotify_refresh_token=" +
          refresh_token
      );
    });
  }
});

app.get("/api/refresh_token", function (req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(
          spotify_client_id + ":" + spotify_client_secret
        ).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    console.log(body);
    var access_token = body.access_token;
    var refresh_token = body.refresh_token;
    // let uri = "http://localhost:5173";
    let uri = "https://roadbuddies.onrender.com";
    res.redirect(
      uri +
        "?spotify_access_token=" +
        access_token +
        "&spotify_refresh_token=" +
        refresh_token
    );
  });
});

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
app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
  res.redirect(authUrl);
});
app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query; // Get the authorization code from the query string

  if (code) {
    try {
      // Exchange the code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Now you can use these tokens to access Google services
      // You might want to store them for later use

      // Redirect the user or send a response
      res.redirect("http://localhost:5173/");
    } catch (error) {
      console.error("Error exchanging code for tokens", error);
      res.status(500).send("Authentication error");
    }
  } else {
    res.status(400).send("Invalid request, authorization code is missing");
  }
});
const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
