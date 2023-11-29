import { Outlet, useNavigate } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import Box from "./Box";
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
      <Box>
          <Outlet /> {/* This will render the child routes */}
      </Box>
    </>
  );
}

export default Trip;
