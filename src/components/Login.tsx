import AppContext from "../context/appContext";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { supabase } = useContext(AppContext);

  const onSubmit = async () => {
    event.preventDefault(); // Prevent default form submission
    try {
      setErr("");
      const { user, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
       /* options: {
          redirectTo: "https://example.com/welcome",
        },*/
      });

      if (error) throw error;

      toast.success(`Welcome ${username}!`);
      navigate(`/`);
    } catch (error: any) {
      setErr(error.message);
      toast.error(error.message);
    }
  };

  const submitWhenEnter = async (event) => {
    if (event.key === "Enter") {
      await onSubmit(event);
    }
  };

  return (
      <>
        {err && (
            <Card style={{ backgroundColor: "lightblue" }}>
              <Card.Body>
                <Card.Title style={{ color: "red" }}>
                  Invalid username or password
                </Card.Title>
                <Card.Text
                    style={{ color: "blue" }}
                    onClick={() => {
                      setErr("");
                      navigate("/login");
                    }}
                >
                  Try again
                </Card.Text>
              </Card.Body>
            </Card>
        )}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
                type="email"
                value={username}
                onChange={(ev) => {
                  setUsername(ev.target.value);
                }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                }}
                onKeyPress={submitWhenEnter}
            />
          </Form.Group>
          <Form.Group>
            <Button variant="success" type="submit" onClick={onSubmit}>
              SUBMIT
            </Button>{" "}
            <Button variant="success" onClick={() => navigate("/")}>
              CANCEL
            </Button>{" "}
          </Form.Group>
        </Form>
        <Button variant="primary" onClick={() => navigate("/register")}>
          Register
        </Button>
      </>
  );
}

export default Login;
