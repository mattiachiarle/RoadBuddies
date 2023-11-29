import { Outlet, useNavigate } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import axios from "axios";
function Trip() {
  const navigate = useNavigate();
  const handleCalendarClick = async () => {
    const accessToken = localStorage.getItem("google_access_token");
    const refreshToken = localStorage.getItem("google_refresh_token");

    if (accessToken && refreshToken) {
      // Navigate to CalendarComponent if tokens are present
      navigate("calendar");
    } else {
      // Initiate OAuth process if no tokens are found
      try {
        //const url = 'http://localhost:3000/auth/google';
        const url = "https://roadbuddies-backend.onrender.com/auth/google";
        const response = await axios.get(url);
        const authUrl = response.data.authUrl;
        window.location.href = authUrl;
      } catch (error) {
        console.error("Error initiating OAuth:", error);
        // Handle error (e.g., show error message)
      }
    }
  };

  return (
    <>
      <Row>
        <Col>
          <div className="sidebar" xs={3}>
            {/* Sidebar content goes here */}
            <Row>
              <Button
                onClick={() => navigate(`editInfo`)}
                variant="primary"
                style={{ border: "1px solid black" }}
              >
                Edit Info
              </Button>
            </Row>
            <Row>
              <Button
                onClick={() => navigate(`chat`)}
                variant="primary"
                style={{ border: "1px solid black" }}
              >
                Chat
              </Button>
            </Row>
            <Row>
              <Button
                onClick={() => navigate(`editToDo`)}
                variant="primary"
                style={{ border: "1px solid black" }}
              >
                Edit To-Do
              </Button>
            </Row>
            <Row>
              <Button
                onClick={() => navigate(`editParticipants`)}
                variant="primary"
                style={{ border: "1px solid black" }}
              >
                Edit Participants
              </Button>
            </Row>
            <Row>
              <Button
                onClick={() => navigate(``)}
                variant="primary"
                style={{ border: "1px solid black" }}
              >
                Info
              </Button>
            </Row>
            <Row>
              <Button
                onClick={() => navigate(`addTransaction`)}
                variant="primary"
                style={{ border: "1px solid black" }}
              >
                Add transaction
              </Button>
            </Row>
            <Row>
              <Button
                onClick={handleCalendarClick}
                variant="primary"
                style={{ border: "1px solid black" }}
              >
                Calendars
              </Button>
            </Row>

            <Row>
              <Button
                onClick={() => navigate(`spotify`)}
                variant="primary"
                style={{ border: "1px solid black" }}
              >
                Spotify
              </Button>
            </Row>
          </div>
        </Col>
        <Col xs={9}>
          <Outlet /> {/* This will render the child routes */}
        </Col>
      </Row>
    </>
  );
}

export default Trip;
