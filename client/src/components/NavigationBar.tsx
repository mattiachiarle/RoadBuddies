import { Link, useMatch, useParams, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext.tsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { IoIosArrowBack } from "react-icons/io";
function NavigationBar(props: {
  email: string;
  updateEmail: (arg0: string) => void;
}) {
  const location = useLocation();
  const currentUrl = location.pathname;
  const matchLogin = useMatch("/login");
  const matchHomepage = useMatch("/");
  const matchCreateTrip = useMatch("/createTrip");
  const matchTrip = useMatch("/trips/:tripId");
  const hide = matchLogin || matchHomepage || matchCreateTrip;
  const navigate = useNavigate();
  const email = props && props.email;
  const supabase = useContext(AppContext);
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("You have been signed out successfully!");
      props.updateEmail("");
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_refresh_token");
      localStorage.removeItem("google_access_token");
      localStorage.removeItem("google_refresh_token");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error(error.message);
    }
  };
  return (
    <Navbar>
      <NavbarBrand onClick={() => navigate("")}>
        {!hide && (
          <p style={{ marginRight: "10%" }} onClick={() => navigate(-1)}>
            <IoIosArrowBack color="white" size="24px" />
          </p>
        )}
        <p
          style={{
            fontWeight: "bold",
            color: "white",
            fontSize: "25px",
            cursor: "pointer",
          }}
        >
          {" "}
          RoadBuddies
        </p>
      </NavbarBrand>

      {matchTrip ? (
        <NavbarContent
          className={hide ? "hidden sm:flex gap-4" : "sm:flex gap-4"}
          justify="center"
        >
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}`}
            >
              Info
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}editInfo`}
            >
              Edit Info
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}Chat`}
            >
              Chat
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}editToDo`}
            >
              Edit To-Do
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}editParticipants`}
            >
              Edit Participants
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}addTransaction`}
            >
              Add transaction
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}spotify`}
            >
              Spotify
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{
                color: "whitesmoke",
                textDecoration: "none",
                backgroundColor: "transparent",
              }}
              to={`${currentUrl}calendar`}
            >
              Calendar
            </Link>
          </NavbarItem>
        </NavbarContent>
      ) : (
        <NavbarContent
          className={hide ? "hidden sm:flex gap-4" : "sm:flex gap-4"}
          justify="center"
        >
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}/..`}
            >
              Info
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}/../editInfo`}
            >
              Edit Info
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}/../Chat`}
            >
              Chat
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}/../editToDo`}
            >
              Edit To-Do
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}/../editParticipants`}
            >
              Edit Participants
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}/../addTransaction`}
            >
              Add transaction
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{ color: "whitesmoke", textDecoration: "none" }}
              to={`${currentUrl}/../spotify`}
            >
              Spotify
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              style={{
                color: "whitesmoke",
                textDecoration: "none",
                backgroundColor: "transparent",
              }}
              to={`${currentUrl}/../calendar`}
            >
              Calendar
            </Link>
          </NavbarItem>
        </NavbarContent>
      )}
      <NavbarContent justify="end">
        <NavbarItem>
          {email ? (
            <Button color="danger" onClick={signOut} variant="flat">
              Sign Out
            </Button>
          ) : (
            <Button
              as={Link}
              color="primary"
              onClick={() => navigate("/login")}
              variant="flat"
            >
              Sign Up
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
export default NavigationBar;
