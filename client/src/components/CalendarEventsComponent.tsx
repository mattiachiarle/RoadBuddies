import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import AppContext from "../context/appContext.tsx";

export default function CalendarEventsComponent() {
    const [events, setEvents] = useState([]);
    const { tripId } = useParams();
    const supabase = useContext(AppContext); // Use the Supabase client from the context

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Retrieve event IDs associated with the tripId from your Supabase table
                const eventIds = await getEventIdsForTrip(tripId);

                // Retrieve the access token from local storage
                const accessToken = localStorage.getItem('google_access_token');
                const refreshToken = localStorage.getItem('google_refresh_token');
                if (!accessToken || !refreshToken) {
                    console.error('No access or refresh token found');
                    return; // Handle the absence of the token
                }

                // Fetch details for each event
                const fetchedEvents = await Promise.all(eventIds.map(async (eventId) => {
                    const response = await axios.get(`http://localhost:3000/api/calendar/event/${eventId}`, {
                        headers: { Authorization: `Bearer ${accessToken}`,
                            'Refresh-Token': refreshToken}
                    });
                    return response.data;
                }));

                setEvents(fetchedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                // Handle error
            }
        };

        fetchEvents();
    }, [tripId, supabase]); // Add supabase to the dependency array

    // Function to get event IDs from Supabase
    const getEventIdsForTrip = async (tripId) => {
        try {
            const { data, error } = await supabase
                .from('events') // Replace with your actual table name
                .select('eventid')
                .eq('tripid', tripId);

            if (error) throw error;
            return data.map(item => item.eventid);
        } catch (error) {
            console.error('Error fetching event IDs:', error);
            return []; // Return an empty array in case of an error
        }
    };

    return (
        <div>
            <h2>Events</h2>
            {events.map((event, index) => (
                <div key={index}>
                    <h3>{event.summary}</h3>
                    <p>{event.description}</p>
                    <p>Location: {event.location}</p>
                    <p>Start: {new Date(event.start.dateTime).toLocaleString()}</p>
                    <p>End: {new Date(event.end.dateTime).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}
