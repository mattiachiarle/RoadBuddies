import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
function CalendarComponent() {
    const [logged, setLogged] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const accessToken = localStorage.getItem("google_access_token");
        const refreshToken = localStorage.getItem("google_refresh_token");
        if (accessToken && refreshToken) {
          setLogged(true);
        }
    }, [logged]);

    const handleCalendarClick = async () => {
          try {
            // const url = 'http://localhost:3000/auth/google';
            const url = "https://roadbuddies-backend.onrender.com/auth/google";
            const response = await axios.get(url);
            const authUrl = response.data.authUrl;
            window.location.href = authUrl;
          } catch (error) {
            console.error("Error initiating OAuth:", error);
          }
      };
    const handleCreateEventClick = () => {
        navigate(`../createEvent`);
    };
    const handleViewEventsClick = () => {
        navigate(`../events`);
    };
    const clearGoogleTokens = () => {
        localStorage.removeItem("google_access_token");
        localStorage.removeItem("google_refresh_token");
        setLogged(false);
      };
    return (
        <>
            {!logged ?
             (
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", minHeight:"80vh", justifyContent:"center",color:"white"}}>
                    <Button onClick={handleCalendarClick} color="warning" variant="ghost">Login into Google<FcGoogle size="20px"/></Button>
              </div>
             ) 
             : 
             (
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", minHeight:"80vh", justifyContent:"center",color:"white", gap:"1rem"}}>
                    <div style={{display:"flex", flexDirection:"row",gap:"1rem"}}>
                        <Button onClick={handleCreateEventClick} color="success" variant="ghost">Create Event</Button>
                        <Button onClick={handleViewEventsClick} color="success" variant="ghost">View Events</Button>
                    </div>
                    <div style={{display:"flex", flexDirection:"row",gap:"1rem"}}>
                    <Button  style={{marginTop:"5rem"}} color="danger" variant="ghost" onClick={clearGoogleTokens}>Logout from Google<FcGoogle size="20px"/></Button>
                    </div>
                </div>
             )
            }

        </>
    );
}
export default CalendarComponent;