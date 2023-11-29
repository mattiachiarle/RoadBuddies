import { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import AppContext from "../context/appContext";
import { useNavigate, useSearchParams } from "react-router-dom";

function DefaultLayout(props: { userEmail: string }) {
  const [trips, setTrips] = useState([]);
  const { userEmail } = props;
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize Supabase client
  const supabase = useContext(AppContext);
  const navigate = useNavigate();

  if (searchParams.get("spotify_access_token")) {
    localStorage.setItem(
      "spotify_access_token",
      searchParams.get("spotify_access_token")
    );
    localStorage.setItem(
      "spotify_refresh_token",
      searchParams.get("spotify_refresh_token")
    );
  }

  useEffect(() => {
    const removeTokenFromUrl = () => {
      const newUrl = window.location.origin + window.location.pathname;
      window.history.pushState('object', document.title, newUrl);
    };

    // Extract tokens from URL
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('accessToken');
    const refreshToken = queryParams.get('refreshToken');

    // Store tokens and remove from URL
    if (accessToken) {
      localStorage.setItem('google_access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('google_refresh_token', refreshToken);
      }
      removeTokenFromUrl();
    }
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
