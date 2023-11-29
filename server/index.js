"use strict";

import {
  listCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  createCalendar,
  deleteCalendar,
  addPeopleToCalendar,
  getCalendarEvent
} from "./utils/calendarUtils.js";

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

// app.use(
//   cors({
//     origin: "https://roadbuddies.onrender.com",
//     credentials: true,
//   })
// );
app.use(
    cors({
      origin:    "http://localhost:5173",
      credentials: true,
    })
);
app.use(express.json()); // This line is crucial for the body-parser to work
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
  //res.redirect(authUrl);
  res.json({ authUrl }); // Send the URL back to the frontend
});
// app.get('/auth/google/callback', async (req, res) => {
//   const { code } = req.query; // Get the authorization code from the query string
//
//   if (code) {
//     try {
//       // Exchange the code for tokens
//       const { tokens } = await oauth2Client.getToken(code);
//       //printing them out just to use postman
//       console.log('Access Token:', tokens.access_token);
//       if (tokens.refresh_token) {
//         console.log('Refresh Token:', tokens.refresh_token);
//       }
//       oauth2Client.setCredentials(tokens);
//
//       // Now you can use these tokens to access Google services
//       // You might want to store them for later use
//
//       // Redirect the user or send a response
//       res.redirect('http://localhost:5173/')
//     } catch (error) {
//       console.error('Error exchanging code for tokens', error);
//       res.status(500).send('Authentication error');
//     }
//   } else {
//     res.status(400).send('Invalid request, authorization code is missing');
//   }
// });
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  if (code) {
    try {
      const { tokens } = await oauth2Client.getToken(code);

      // Construct the redirect URL with tokens as query parameters
      let redirectUrl = `http://localhost:5173/?accessToken=${tokens.access_token}`;
      if (tokens.refresh_token) {
        redirectUrl += `&refreshToken=${tokens.refresh_token}`;
      }

      // Redirect the user to the frontend with the tokens
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error exchanging code for tokens', error);
      res.status(500).send('Authentication error');
    }
  } else {
    res.status(400).send('Invalid request, authorization code is missing');
  }
});

app.get('/api/calendar/events', async (req, res) => {
  try {
    const calendarId = req.query.calendarId || 'primary'; // Use query parameter or default to 'primary'
    const events = await listCalendarEvents(oauth2Client, calendarId);
    res.json(events);
  } catch (error) {
    res.status(500).send('Error fetching calendar events');
  }
});

app.post('/api/calendar/event', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.headers['refresh-token']; // Assume the refresh token is sent in a custom header

    if (!authHeader || !refreshToken) {
      return res.status(401).send('No authorization or refresh token provided');
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    const createEvent = async () => {
      try {
        return await createCalendarEvent(oauth2Client, req.body);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Use the refresh token to get a new access token
          oauth2Client.setCredentials({ refresh_token: refreshToken });
          const { credentials } = await oauth2Client.refreshAccessToken();
          oauth2Client.setCredentials(credentials);
          return await createCalendarEvent(oauth2Client, req.body);
        } else {
          throw error;
        }
      }
    };

    const newEvent = await createEvent();
    res.json(newEvent);
  } catch (error) {
    console.error('Error creating calendar event', error);
    res.status(500).send('Error creating calendar event');
  }
});


app.get('/api/calendar/event/:eventId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.headers['refresh-token']; // Assume the refresh token is sent in a custom header

    if (!authHeader || !refreshToken) {
      return res.status(401).send('No authorization or refresh token provided');
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    // Function to refresh access token
    const refreshAccessToken = async () => {
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      return credentials.access_token;
    };

    // Function to get calendar event
    const getEvent = async (eventId) => {
      try {
        return await getCalendarEvent(oauth2Client, eventId);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Refresh the token and retry
          const newAccessToken = await refreshAccessToken();
          oauth2Client.setCredentials({ access_token: newAccessToken });
          return await getCalendarEvent(oauth2Client, eventId);
        } else {
          throw error;
        }
      }
    };

    const eventId = req.params.eventId;
    const event = await getEvent(eventId);
    res.json(event);
  } catch (error) {
    console.error('Error retrieving calendar event', error);
    res.status(500).send('Error retrieving calendar event');
  }
});

// Route to update a calendar event
app.put('/api/calendar/event/:eventId', async (req, res) => {
  try {
    const updatedEvent = await updateCalendarEvent(oauth2Client, req.params.eventId, req.body);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).send('Error updating calendar event');
  }
});

// Route to delete a calendar event
app.delete('/api/calendar/event/:eventId', async (req, res) => {
  try {
    await deleteCalendarEvent(oauth2Client, req.params.eventId);
    res.send('Event deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting calendar event');
  }
});

// Route to create a new calendar
app.post('/api/calendar', async (req, res) => {
  try {
    const newCalendar = await createCalendar(oauth2Client, req.body);
    res.json(newCalendar);
  } catch (error) {
    res.status(500).send('Error creating calendar');
  }
});

// Route to delete a calendar
app.delete('/api/calendar/:calendarId', async (req, res) => {
  try {
    await deleteCalendar(oauth2Client, req.params.calendarId);
    res.send('Calendar deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting calendar');
  }
});

// Route to add people to a calendar
app.post('/api/calendar/:calendarId/people', async (req, res) => {
  try {
    const acl = await addPeopleToCalendar(oauth2Client, req.params.calendarId, req.body.emailAddresses);
    res.json(acl);
  } catch (error) {
    res.status(500).send('Error adding people to calendar');
  }
});
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
