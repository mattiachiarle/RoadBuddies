import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../context/appContext.tsx";
import { User } from "../utils/types.ts";
import { Button, Input, Textarea } from "@nextui-org/react";
import { LuText } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import "../utils/css/datePicker.css";
export default function CreateEventComponent() {
  const { tripId } = useParams();
  const supabase = useContext(AppContext);
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState({
    summary: "",
    location: "",
    description: "",
    start: "" ,
    end: "",
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 1440 },
        { method: "popup", minutes: 10 },
      ],
    },
    attendees: [],
  });
  // Fetch participants on component load
  useEffect(() => {
    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("user_id")
        .eq("group_id", tripId);

      if (error) {
        console.error("Error fetching participants:", error);
      } else {
        // Convert user IDs to attendee objects
        const attendees = data.map((participant: User) => ({
          email: participant.user_id,
        }));
        setEventDetails((prevDetails) => ({
          ...prevDetails,
          attendees: attendees,
        }));
      }
    };

    fetchParticipants();
  }, [tripId, supabase]);
  // Function to format date and time for Google Calendar API

  const handleDateTimeChange = (date, field) => {
    setEventDetails({
      ...eventDetails,
      [field]: date.toISOString(), // Directly setting the date object
    });
    console.log(eventDetails)
  };

  // Add and remove attendees
  const handleAddAttendee = () => {
    setEventDetails({
      ...eventDetails,
      attendees: [...eventDetails.attendees, { email: "" }],
    });
  };

  const handleAttendeeEmailChange = (email, index) => {
    const newAttendees = [...eventDetails.attendees];
    newAttendees[index].email = email;
    setEventDetails({ ...eventDetails, attendees: newAttendees });
  };

  const handleRemoveAttendee = (index) => {
    const newAttendees = eventDetails.attendees.filter(
      (_, idx) => idx !== index
    );
    setEventDetails({ ...eventDetails, attendees: newAttendees });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Filter out empty attendee emails
    const validAttendees = eventDetails.attendees.filter(
      (attendee) => attendee.email.trim() !== ""
    );
    // Construct the final event object
    const finalEventDetails = {
      ...eventDetails,
      start: { dateTime: eventDetails.start, timeZone: "America/Los_Angeles" },
      end: { dateTime: eventDetails.end, timeZone: "America/Los_Angeles" },
      attendees: validAttendees,
    };
    console.log("Final Event Details:", finalEventDetails);
    // Retrieve the access token from local storage
    const accessToken = localStorage.getItem("google_access_token");
    const refreshToken = localStorage.getItem("google_refresh_token");
    if (!accessToken || !refreshToken) {
      console.error("No access or refresh token found");
      return; // Optionally, redirect to login
    }

    try {
      // const url = 'http://localhost:3000/api/calendar/event';
      const url = "https://roadbuddies-backend.onrender.com/api/calendar/event";
      const response = await axios.post(url, finalEventDetails, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Refresh-Token": refreshToken,
        },
      });
      console.log(response.data);
      //console.log(response.data.id)
      // Handle successful event creation

      const { data, error } = await supabase
        .from("events")
        .insert([{ tripid: tripId, eventid: response.data.id }]);
      if (error) {
        console.error("Error inserting data into Supabase:", error);
      } else {
        console.log("Data inserted into Supabase:", data);
      }
      navigate(`../calendar`);
    } catch (error) {
      console.error("Error creating event:", error);
      // Handle error
    }
  };

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem"}}>
      <div style={{display:"flex", flexDirection:"row", width:"50%"}}>
        <Input type="text" label="Add Title" variant="underlined" value={eventDetails.summary} onChange={(e) => setEventDetails({ ...eventDetails, summary: e.target.value })}></Input>
      </div>
      <div style={{display:"flex", flexDirection:"row", width:"50%", color:"white"}}>
        <Textarea type="text"  label={<div style={{display:"flex", flexDirection:"row",gap:"4px"}}><LuText style={{marginTop:"4px"}} />Description</div>} variant="bordered" value={eventDetails.description} onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}></Textarea>
      </div>
      <div style={{display:"flex", flexDirection:"row", width:"50%"}}>
        <Input type="text" label={<div style={{display:"flex", flexDirection:"row",gap:"4px"}}><IoLocationOutline style={{marginTop:"4px"}} />Add Location</div>} variant="underlined" value={eventDetails.location} onChange={ (e) => {  setEventDetails({ ...eventDetails, location: e.target.value })}}></Input>
      </div>
      <div style={{display:"flex", flexDirection:"row", width:"50%", gap:"1rem", color:"white", justifyContent:"center"}}>
         <DateTimePicker 
          value={dayjs(eventDetails.start)}
          onChange={(date) => {handleDateTimeChange(date, "start")}}
          orientation="landscape"
          label={<div style={{color:"white"}}>Start Date and Time</div>}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />
         <DateTimePicker 
          className="date-picker"
          value={dayjs(eventDetails.end)}
          onChange={(date) => {handleDateTimeChange(date, "end")}}
          orientation="landscape"
          label={<div style={{color:"white"}}>End Date and Time</div>}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />
      </div>
      <div style={{display:"flex", flexDirection:"row", width:"50%", gap:"1rem", color:"white", justifyContent:"center"}}>
        <Button variant="ghost" color="success" onClick={handleSubmit}>
            Save
        </Button>
      </div>
    </div>
    // <form onSubmit={handleSubmit} style={{color: "white"}}>
    //   <div>
    //     <label>Event Name:</label>
    //     <input
    //       type="text"
    //       value={eventDetails.summary}
    //       onChange={(e) =>
    //         setEventDetails({ ...eventDetails, summary: e.target.value })
    //       }
    //     />
    //   </div>
    //   <div>
    //     <label>Description:</label>
    //     <textarea
    //       value={eventDetails.description}
    //       onChange={(e) =>
    //         setEventDetails({ ...eventDetails, description: e.target.value })
    //       }
    //     />
    //   </div>
    //   <div>
    //     <label>Location:</label>
    //     <input
    //       type="text"
    //       value={eventDetails.location}
    //       onChange={(e) =>
    //         setEventDetails({ ...eventDetails, location: e.target.value })
    //       }
    //     />
    //   </div>
    //   <div>
    //     <label>Start Date and Time:</label>
    //     <ReactDatePicker
    //       selected={new Date(eventDetails.start)}
    //       onChange={(date) => handleDateTimeChange(date, "start")}
    //       showTimeSelect
    //       dateFormat="yyyy-MM-dd'T'HH:mm:ssXXX"
    //       timeFormat="HH:mm"
    //     />
    //   </div>
    //   <div>
    //     <label>End Date and Time:</label>
    //     <ReactDatePicker
    //       selected={new Date(eventDetails.end)}
    //       onChange={(date) => handleDateTimeChange(date, "end")}
    //       showTimeSelect
    //       dateFormat="yyyy-MM-dd'T'HH:mm:ssXXX"
    //       timeFormat="HH:mm"
    //     />
    //  </div>
      // {/*<div>*/}
      // {/*    <label>Attendees:</label>*/}
      // {/*    {eventDetails.attendees.map((attendee, index) => (*/}
      // {/*        <div key={index}>*/}
      // {/*            <input*/}
      // {/*                type="email"*/}
      // {/*                placeholder="Attendee's email"*/}
      // {/*                value={attendee.email}*/}
      // {/*                onChange={(e) => handleAttendeeEmailChange(e.target.value, index)}*/}
      // {/*            />*/}
      // {/*            <button type="button" onClick={() => handleRemoveAttendee(index)}>Remove</button>*/}
      // {/*        </div>*/}
      // {/*    ))}*/}
      // {/*    <button type="button" onClick={handleAddAttendee}>Add Attendee</button>*/}
      // {/*</div>*/}
      // {/* ... other fields ... */}
    //   <button type="submit">Submit</button>
    // </form>
  );
}
