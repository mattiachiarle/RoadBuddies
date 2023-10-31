import { useContext, useEffect, useState } from "react"; // import your supabase client
import AppContext from "../context/appContext";
import { Trip } from "../utils/types";
import "../utils/css/tripInfo.css";
import { useParams } from "react-router-dom";

function TripInfo() {
  const supabase = useContext(AppContext);
  const [trip, setTrip] = useState<Trip | null>(null);

  const { tripId } = useParams();

  useEffect(() => {
    const fetchTrip = async () => {
      const { data, error } = await supabase
        .from("group")
        .select("*")
        .eq("id", tripId)
        .single();

      if (error) {
        console.error("Error fetching trip:", error);
      } else if (data) {
        setTrip(data);
      }
    };

    fetchTrip();
  }, []);

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <div className="trip-info">
      <h2>Trip Information</h2>
      <div>
        <strong>Start Date:</strong> {new Date(trip.startDate).toDateString()}
      </div>
      <div>
        <strong>End Date:</strong> {new Date(trip.endDate).toDateString()}
      </div>
      <div>
        <strong>Vehicle:</strong> {trip.vehicle}
      </div>
      <div>
        <strong>Participants:</strong>
        <ul>
          {trip.participants?.map((participant) => (
            <li key={participant}>{participant}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TripInfo;
