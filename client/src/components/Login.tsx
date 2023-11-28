import AppContext from "../context/appContext";
import {  CardFooter, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardHeader, Divider, Input } from "@nextui-org/react";

function Login({ email, updateEmail }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false); // [1
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const supabase = useContext(AppContext);

  useEffect(() => {
    if (email != "") {
      navigate(`/`);
    }
  }, [email]);

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      setErr("");
      const { error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
        /* options: {
          redirectTo: "https://example.com/welcome",
        },*/
      });

      if (error) throw error;

      toast.success(`Welcome ${username}!`);
      updateEmail(username);
      navigate(`/`);
    } catch (error) {
      console.log(error);
      setErr(error.message);
      setInvalid(true);
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
      <div className = "login"  style={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flexDirection:"column"}}>
        <Card>
          <CardHeader style={{ justifyContent:"center"}}>
            <h1>RoadBuddies</h1>
          </CardHeader>
          <Divider/>
          <CardBody>
            <div className="flex w-full flex-wrap sd:flex-nowrap gap-3">
              <Input type="email" value={username} isInvalid={invalid} label="Email" onChange={(ev)=>{setUsername(ev.target.value)}} placeholder="email"/>
              <Input type="password" isInvalid={invalid} errorMessage={invalid && "invalid username or password"} value={password} label="Password" onChange={(ev)=>{setPassword(ev.target.value)}} placeholder="password"/>
            </div>
            </CardBody>
            <CardFooter style={{padding:"15px"}} className="flex w-full flex-wrap sd:flex-nowrap gap-3">
              <Button  type="submit" onClick={onSubmit}>Submit</Button>
              <Button onClick={() => navigate("/")}>Cancel</Button>
              <Button onClick={() => navigate("/register")}>Register</Button>
            </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Login;
