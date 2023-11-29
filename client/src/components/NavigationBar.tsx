import { Link, useMatch, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext.tsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
function NavigationBar(props: {
  email: string;
  updateEmail: (arg0: string) => void;
}) {
  const tripId = useParams();
  const matchLogin = useMatch("/login");
  const matchHomepage = useMatch("/");
  const matchCreateTrip = useMatch("/createTrip");
  const matchTrip = useMatch("/trips/:tripId");
  const [trip_id, setTripId] = useState<string | undefined>("");
  useEffect(() => {
    if(matchTrip) setTripId(matchTrip.params.tripId);
  },[ matchTrip, tripId])
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
  const hide = matchLogin || matchHomepage || matchCreateTrip ; 
  const navigate = useNavigate();
  const email = props && props.email;
  const supabase = useContext(AppContext);
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("You have been signed out successfully!");
      props.updateEmail("");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error(error.message);
    }
  };
  return (
    <Navbar >
    <NavbarBrand onClick={() => navigate("")}>
      {!hide && <p style={{marginRight:"10%"}} onClick={() => navigate(-1)}><IoIosArrowBack color="white" size="24px"/></p>}
      <p style={{fontWeight:"bold", color:"white", fontSize:"25px", cursor:"pointer"}}> RoadBuddies</p>
    </NavbarBrand>
    <NavbarContent className={hide? "hidden sm:flex gap-4" : "sm:flex gap-4"} justify="center">
    <NavbarItem >
        <Link style={{color:"whitesmoke",textDecoration:"none" }} to={`trips/${trip_id}`} >
          Info
        </Link>
      </NavbarItem>
      <NavbarItem >
        <Link style={{color:"whitesmoke",textDecoration:"none" }} to={`trips/${trip_id}/editInfo`} >
          Edit Info
        </Link>
      </NavbarItem>
      <NavbarItem >
        <Link style={{color:"whitesmoke",textDecoration:"none" }} to={`trips/${trip_id}/Chat`} >
          Chat
        </Link>
      </NavbarItem>
      <NavbarItem >
        <Link style={{color:"whitesmoke",textDecoration:"none" }} to={`trips/${trip_id}/editToDo`} >
          Edit To-Do
        </Link>
      </NavbarItem>
      <NavbarItem >
        <Link style={{color:"whitesmoke",textDecoration:"none" }} to={`trips/${trip_id}/editParticipants`} >
          Edit Participants
        </Link>
      </NavbarItem>
      <NavbarItem >
        <Link style={{color:"whitesmoke",textDecoration:"none" }} to={`trips/${trip_id}/addTransaction`} >
          Add transaction
        </Link>
      </NavbarItem>
      <NavbarItem >
        <Link style={{color:"whitesmoke",textDecoration:"none" }} to={`trips/${trip_id}/spotify`} >
          Spotify
        </Link>
      </NavbarItem>
      <NavbarItem >
        <Link style={{color:"whitesmoke",textDecoration:"none",backgroundColor:"transparent" }} onClick={handleCalendarClick} >
          Calendar
        </Link>
      </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">          
      <NavbarItem>
        {email?
        (<Button color="danger" onClick={signOut} variant="flat">
          Sign Out
          </Button>
        )
        : 
        (<Button as={Link} color="primary" onClick={() => navigate("/login")} variant="flat">
          Sign Up
        </Button>)
        }
      </NavbarItem>
    </NavbarContent>
  </Navbar>
    // <Navbar bg="primary" data-bs-theme="dark">
    //   <Container>
        // <Button onClick={() => navigate(-1)}>
        //   <i
        //     className="fa fa-chevron-circle-left"
        //     style={{ fontSize: "30px" }}
        //   ></i>
        // </Button>
    //     <Navbar.Brand href="/">RoadBuddies</Navbar.Brand>
    //     <Nav className="ms-auto">
    //       {email ? (
    //         <>
    //           <Navbar.Text className="me-3">Hello, {email}</Navbar.Text>{" "}
    //           <Button variant="danger" onClick={signOut}>
    //             Sign Out
    //           </Button>
    //         </>
    //       ) : (
    //         <Button
    //           onClick={() => redirect("/login")}
    //           style={{ border: "1px solid white" }}
    //         >
    //           Login
    //         </Button>
    //       )}
    //     </Nav>
    //   </Container>
    // </Navbar>
  );
}
export default NavigationBar;
