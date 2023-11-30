import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import AppContext from "../context/appContext.tsx";
import dayjs from 'dayjs';
import { MyEvent } from '../utils/types.ts';
import Container from './Container.tsx';
import { Card, CardBody, Divider } from '@nextui-org/react';
import { CardHeader } from 'react-bootstrap';

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
                    // const uri = `http://localhost:3000/api/calendar/event/${eventId}`;
                    const uri = `https://roadbuddies-backend.onrender.com/api/calendar/event/${eventId}`;
                    const response = await axios.get(uri, {
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
        console.log(events);    
    }, [tripId, supabase]); // Add supabase to the dependency array

    // Function to get event IDs from Supabase
    const getEventIdsForTrip = async (tripId) => {
        try {
            const { data, error } = await supabase
                .from('events') // Replace with your actual table name
                .select('eventid')
                .eq('tripid', tripId);

            if (error) throw error;
            console.log('Event IDs:', data)
            return data.map(item => item.eventid);
        } catch (error) {
            console.error('Error fetching event IDs:', error);
            return []; // Return an empty array in case of an error
        }
    };

    return (
        <>
       <h3 style={{color:"white", textAlign:"center"}}>Your Trips</h3>
       <Container>
       {events.length > 0 ? (
          events
          .sort((a, b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime())
          .map((event : MyEvent, index) => (
            <Card
              shadow="sm"
              key={index}
              style={{ margin: "10px 0", justifyContent:"center" }}
            >
            <CardHeader>
                <h4 style={{padding:"5px"}}>{event.summary}</h4>
            </CardHeader>
            <CardBody>
                <div style={{display:"flex",width:"100%", flexDirection:"column", alignItems:"center"}}>
                    <div>{event.description}</div>
                    <div>Location: {event.location}</div>
                    <p>Start: {dayjs(event.start.dateTime).format("MMMM D, YYYY")}</p>
                    <p>End: {dayjs(event.end.dateTime).format("MMMM D, YYYY")}</p>
                </div>
            </CardBody>
            </Card>
          ))
          )
          :
          (
            <p>No events found.</p>
          )

        }
        </Container>        
        </>
        // <div style={{color:"white", display:"flex", flexDirection:"column", justifyItems:"center", alignItems:"center"}}>
        //     <h2>Events</h2>
        //     {events.map((event : MyEvent, index) => (
        //         <div key={index}>
        //             <h3>{event.summary}</h3>
        //             <p>{event.description}</p>
        //             <p>Location: {event.location}</p>
        //             <p>Start: {dayjs(event.start.dateTime).format("MMMM D, YYYY")}</p>
        //             <p>End: {dayjs(event.end.dateTime).format("MMMM D, YYYY")}</p>
        //         </div>
        //     ))}
        // </div>
    );
}
