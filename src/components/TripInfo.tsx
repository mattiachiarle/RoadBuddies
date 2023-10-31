import { useEffect, useState } from "react"; // import your supabase client
import { useAppContext } from "../context/appContext";
import { Trip } from "../utils/types";
import "../utils/css/tripInfo.css";

function TripInfo({id}: string) {
  const { supabase } = useAppContext();
  const [trip, setTrip] = useState<Trip | null>(null);
  useEffect(() => {
    const fetchTrip = async () => {
      const { data, error } = await supabase.from("trips").select("*").eq('id',id).single();

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
          {trip.participants.map((participant) => (
            <li key={participant}>{participant}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TripInfo;
