import { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import AppContext from "../context/appContext";
import { useNavigate, useSearchParams } from "react-router-dom";

function DefaultLayout(props: { userEmail: string }) {
  const [trips, setTrips] = useState([]);
  const { userEmail } = props;
  const [url, setUrl] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSpotify, setShowSpotify] = useState(false);

  if (searchParams.get("access_token")) {
    localStorage.setItem(
      "spotify_access_token",
      searchParams.get("access_token")
    );
    localStorage.setItem(
      "spotify_refresh_token",
      searchParams.get("refresh_token")
    );
  }

  // Initialize Supabase client
  const supabase = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      if (userEmail) {
        try {
          const { data: tripsData, error } = await supabase
            .from("trips")
            .select("group_id, group:group_id (id, name)")
            .eq("user_id", userEmail);

          if (error) throw error;

          // Set the trips in state
          setTrips(
            tripsData.map((trip: { group: { id: number; name: string } }) => ({
              id: trip.group.id,
              name: trip.group.name,
            }))
          );
        } catch (error) {
          console.error("Error fetching trips:", error);
        }
      } else {
        navigate("/login");
      }
    };

    fetchTrips();
  }, [userEmail, supabase, navigate]);

  return (
    <>
      <Row>
        <Col>
          <h3>Your Trips</h3>
          {trips.length > 0 ? (
            trips.map((trip) => (
              <Card
                key={trip.id}
                style={{ margin: "10px 0", cursor: "pointer" }}
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <Card.Body>{trip.name}</Card.Body>
              </Card>
            ))
          ) : (
            <p>No trips found.</p>
          )}
        </Col>
      </Row>
      <Row>
        <Button
          onClick={() => {
            navigate(`/createTrip`);
          }}
        >
          Add Trip
        </Button>
      </Row>
    </>
  );
}

export default DefaultLayout;
