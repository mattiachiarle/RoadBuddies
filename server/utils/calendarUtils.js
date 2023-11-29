import { google } from 'googleapis';

async function listCalendarEvents(oauth2Client, calendarId) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        const response = await calendar.events.list({
            calendarId: calendarId, // Use the provided calendarId
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching calendar events', error);
        throw error;
    }
}

async function createCalendarEvent(oauth2Client, eventDetails) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        const calendarId = eventDetails.calendarId || 'primary';
        const { calendarId: _, ...eventData } = eventDetails;
        const event = await calendar.events.insert({
            calendarId: calendarId,
            resource: eventData,
        });
        return event.data;
    } catch (error) {
        console.error('Error creating calendar event', error);
        throw error;
    }
}

async function updateCalendarEvent(oauth2Client, eventId, updatedDetails) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        const { calendarId, ...eventData } = updatedDetails;
        const targetCalendarId = calendarId || 'primary'; // Use provided calendarId or default to 'primary'

        const event = await calendar.events.update({
            calendarId: targetCalendarId,
            eventId: eventId,
            resource: eventData,
        });
        return event.data;
    } catch (error) {
        console.error('Error updating calendar event', error);
        throw error;
    }
}

async function deleteCalendarEvent(oauth2Client, eventId) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });
    } catch (error) {
        console.error('Error deleting calendar event', error);
        throw error;
    }
}

async function createCalendar(oauth2Client, calendarDetails) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        const newCalendar = await calendar.calendars.insert({
            resource: calendarDetails,
        });
        return newCalendar.data;
    } catch (error) {
        console.error('Error creating calendar', error);
        throw error;
    }
}

async function deleteCalendar(oauth2Client, calendarId) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        await calendar.calendars.delete({
            calendarId: calendarId,
        });
    } catch (error) {
        console.error('Error deleting calendar', error);
        throw error;
    }
}

async function addPeopleToCalendar(oauth2Client, calendarId, emailAddresses) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        const acl = await calendar.acl.insert({
            calendarId: calendarId,
            resource: {
                role: 'writer', // Or 'reader', depending on the desired level of access
                scope: {
                    type: 'user',
                    value: emailAddresses,
                },
            },
        });
        return acl.data;
    } catch (error) {
        console.error('Error adding people to calendar', error);
        throw error;
    }
}
async function getCalendarEvent(oauth2Client, eventId) {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        const response = await calendar.events.get({
            calendarId: 'primary', // or a specific calendar ID
            eventId: eventId,
        });
        return response.data;
    } catch (error) {
        console.error('Error retrieving calendar event', error);
        throw error;
    }
}
export { listCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent, createCalendar, deleteCalendar, addPeopleToCalendar, getCalendarEvent };
