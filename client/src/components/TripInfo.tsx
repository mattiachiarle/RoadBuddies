import { useContext, useEffect, useState } from "react"; // import your supabase client
import AppContext from "../context/appContext";
import { Trip, User } from "../utils/types";
import "../utils/css/tripInfo.css";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Card, CardFooter, Divider } from "@nextui-org/react";
function TripInfo({ email }: { email: string }) {
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
        const participants = participantData.map(
          (participant: User) => participant.user_id
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
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        gap: "10px",
      }}
    >
      <Card
        className="trip-info"
        style={{
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "start",
          gap: "10px",
          width: "500px",
        }}
      >
        <h2>Trip Information</h2>
        <Divider />
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <div>
            <strong style={{ color: "#db9fc7" }}>Start Date: </strong>{" "}
            {dayjs(trip.start_date).format("MMMM D, YYYY")}
          </div>
          <div>
            <strong style={{ color: "#db9fc7" }}>End Date: </strong>{" "}
            {dayjs(trip.end_date).format("MMMM D, YYYY")}
          </div>
        </div>
        <div>
          <strong style={{ color: "#db9fc7" }}>Start location: </strong>
          {trip.start}
        </div>
        <div>
          <strong style={{ color: "#db9fc7" }}>Destination: </strong>{" "}
          {trip.destination}
        </div>
        <div>
          <strong style={{ color: "#db9fc7" }}>Vehicle:</strong> {trip.vehicle}
        </div>
        <div>
          <strong style={{ color: "#db9fc7" }}>Participants:</strong>
          {participants?.map((participant) => (
            <div
              style={
                participant === email ? { textDecoration: "underline" } : {}
              }
              key={participant}
            >
              {participant}
            </div>
          ))}
        </div>
        <CardFooter />
      </Card>
    </div>
  );
}

export default TripInfo;
