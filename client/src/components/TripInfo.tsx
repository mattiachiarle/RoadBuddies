import { useContext, useEffect, useState } from "react"; // import your supabase client
import AppContext from "../context/appContext";
import { Trip } from "../utils/types";
import "../utils/css/tripInfo.css";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
function TripInfo({ email }) {
  const supabase = useContext(AppContext);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [participants, setParticipants] = useState<Array<string>>([]);
  const { tripId } = useParams();

  useEffect(() => {
    const fetchTrip = async () => {
      const { data: tripData, error: tripError } = await supabase
        .from("group")
        .select("*")
        .eq("id", tripId)
        .single();

      if (tripError) {
        console.error("Error fetching trip:", tripError);
      } else if (tripData) {
        setTrip(tripData);
      }
      const { data: participantData, error: participantError } = await supabase
        .from("trips")
        .select("user_id")
        .eq("group_id", tripId);

      if (participantError) {
        console.error("Error fetching participants:", participantError);
      } else if (participantData) {
        // Assuming that the user_id is the participant
        const participants = participantData.map(
          (participant) => participant.user_id,
        );
        setParticipants(participants);
      }
    };

    fetchTrip();
  }, [tripId, supabase, email]);

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <div className="trip-info">
      <h2>Trip Information</h2>
      <div>
        <strong>Start Date:</strong>{" "}
        {dayjs(trip.start_date).format("MMMM D, YYYY")}
      </div>
      <div>
        <strong>End Date:</strong> {dayjs(trip.end_date).format("MMMM D, YYYY")}
      </div>
      <div>
        <strong>Start location:</strong>
        {trip.start}
      </div>
      <div>
        <strong>Destination:</strong> {trip.destination}
      </div>
      <div>
        <strong>Vehicle:</strong> {trip.vehicle}
      </div>
      <div>
        <strong>Participants:</strong>
        <ul>
          {participants?.map((participant) => (
            <li
              style={
                participant === email ? { textDecoration: "underline" } : {}
              }
              key={participant}
            >
              {participant}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TripInfo;
