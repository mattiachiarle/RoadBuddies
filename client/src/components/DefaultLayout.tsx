import { useContext, useEffect, useState } from "react";
import Container from "./Container";
import {Card, CardBody, CardHeader } from "@nextui-org/react";
import AppContext from "../context/appContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoPlus } from "react-icons/go";


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
      window.history.pushState("object", document.title, newUrl);
    };

    const checkGoogleTokens = async () => {
      // Extract tokens from URL
      // const queryParams = new URLSearchParams(window.location.search);
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (accessToken) {
        localStorage.setItem("google_access_token", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("google_refresh_token", refreshToken);
      }

      const local_refresh_token = localStorage.getItem("google_refresh_token");

      if (local_refresh_token && userEmail) {
        const { error } = await supabase
          .from("user")
          .update([{ google_refresh_token: local_refresh_token }])
          .eq("user_id", userEmail);

        if (error) {
          console.log("Supabase error: " + error);
        }
      } else {
        const { data } = await supabase
          .from("user")
          .select("google_refresh_token")
          .eq("user_id", userEmail);
        if (data && data[0] && data[0].google_refresh_token) {
          localStorage.setItem(
            "google_refresh_token",
            data[0].google_refresh_token
          );
        }
      }
      // if (accessToken && userEmail) {
      //   // Store tokens and remove from URL
      //   localStorage.setItem("google_access_token", accessToken);
      //   if (refreshToken) {
      //     console.log(userEmail);
      //     console.log(refreshToken);
      //     const { data, error } = await supabase
      //       .from("user")
      //       .update([{ google_refresh_token: refreshToken }])
      //       .eq("user_id", userEmail)
      //       .select();
      //     localStorage.setItem("google_refresh_token", refreshToken);
      //     // if (error) {
      //     console.log(data);
      //     console.log("Supabase error " + error);
      //     // }
      //   } else {
      //     const refresh_token = await supabase
      //       .from("user")
      //       .select("google_refresh_token")
      //       .eq("user_id", userEmail);
      //     localStorage.setItem(
      //       "google_refresh_token",
      //       refresh_token.google_refresh_token
      //     );
      //   }
      removeTokenFromUrl();
      // }
    };
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
    checkGoogleTokens();
  }, [userEmail]);

  return (
    <>
       <h3 style={{color:"white", textAlign:"center"}}>Your Trips</h3>
       <Container>
       {trips.length > 0 ? (
          trips.map((trip) => (
            <Card
              shadow="sm"
              key={trip.id}
              style={{ margin: "10px 0", cursor: "pointer", justifyContent:"center" }}
              isPressable
              onPress={() => navigate(`/trips/${trip.id}/`)}
            >
              <div style={{display:"flex",width:"100%", flexDirection:"column", alignItems:"center"}}>{trip.name}</div>

            </Card>
          ))
          )
          :
          (
            <p>No trips found.</p>
          )

        }
        <Card
              shadow="sm"
              style={{ margin: "10px 0", cursor: "pointer", justifyContent:"center" }}
              isPressable
              onPress={() => navigate(`/createTrip`)}
            >
              <div style={{display:"flex",width:"100%", flexDirection:"column", alignItems:"center"}}><GoPlus size="25px"/></div>

            </Card>
        </Container>
      {/* <Row>
        <Col>
          <h3 style={{color:"white"}}>Your Trips</h3>
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
      </Row> */}
    </>
  );
}

export default DefaultLayout;
