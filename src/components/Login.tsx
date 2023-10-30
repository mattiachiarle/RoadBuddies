import { useAppContext } from "../context/appContext";
import {Button, Card, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import { toast } from 'react-toastify';

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]= useState("");
  const navigate = useNavigate();
  const { supabase } = useAppContext();

  const onSubmit = async () => {
    try {
      setErr("");
      const {data, error} = await supabase.auth.signInWithPassword({
        email: "example@email.com",
        password: "example-password",
        options: {
          redirectTo: "https//example.com/welcome",
        },
      });
     // props.setUser(user); //props do not exist yet
      toast.success("Welcome "/*+user.email+"!"*/); // how do I get the email?
      navigate(`/`);
    } catch (error: any) {
        setErr(error.message);
        toast.error(error.message);
    }
  };
  return(<>

        {err &&
            <Card style={{backgroundColor: "lightblue"}} >
              <Card.Body>
                <Card.Title  style={{ color: 'red' }}>Invalid username or password</Card.Title>
                <Card.Text style={{ color: 'blue' }}  onClick={()=>{setErr("");navigate("/login")}} >
                  Try again
                </Card.Text>
              </Card.Body>
            </Card>
        } {/* if err is true, display the paragraph */}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" >
            <Form.Label>username</Form.Label>
            <Form.Control type="email" value ={username} onChange={(ev)=>{setUsername(ev.target.value)}}/>
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Label>password</Form.Label>
            <Form.Control type="password" value ={password} onChange={(ev)=>{setPassword(ev.target.value)}} onKeyPress={submitWhenEnter}/>
          </Form.Group>
          <Form.Group>
            <Button variant="success" onClick={onSubmit}> SUBMIT </Button>{' '}
            <Button variant="success" onClick={()=>navigate("/")}> CANCEL </Button>{' '}
          </Form.Group>
        </Form>

      </>


  )
}
export default Login;
