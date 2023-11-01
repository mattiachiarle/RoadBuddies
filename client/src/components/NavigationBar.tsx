import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { redirect } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../context/appContext.tsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
//sign out is here

function NavigationBar(props: {
  email: string;
  updateEmail: (arg0: string) => void;
}) {
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
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Button onClick={() => navigate(-1)}>
          <i
            className="fa fa-chevron-circle-left"
            style={{ fontSize: "30px" }}
          ></i>
        </Button>
        <Navbar.Brand href="/">RoadBuddies</Navbar.Brand>
        <Nav className="ms-auto">
          {email ? (
            <>
              <Navbar.Text className="me-3">Hello, {email}</Navbar.Text>{" "}
              <Button variant="danger" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => redirect("/login")}
              style={{ border: "1px solid white" }}
            >
              Login
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
export default NavigationBar;
