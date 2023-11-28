import { useContext, useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import AppContext from "../context/appContext";
import { useNavigate } from "react-router-dom";
import Container from "./Container";
import {Card, CardBody, CardHeader } from "@nextui-org/react";

function DefaultLayout(props: { userEmail: string }) {
  const [trips, setTrips] = useState([]);
  const { userEmail } = props;

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
          console.log(tripsData)
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
       <h3 style={{color:"white", textAlign:"center"}}>Your Trips</h3>
       <Container>
       {trips.length > 0 ? (
          trips.map((trip) => (
            <Card
              shadow="sm"
              key={trip.id}
              style={{ margin: "10px 0", cursor: "pointer", justifyContent:"center" }}
              isPressable
              onPress={() => navigate(`/trips/${trip.id}`)}
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
