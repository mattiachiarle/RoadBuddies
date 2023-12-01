import AppContext from "../context/appContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from "@nextui-org/react";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<boolean>(false);
  const navigate = useNavigate();
  const supabase = useContext(AppContext);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way
    try {
      setErr(false);
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        disableEmailConfirmation: true,
      });
      insertUser(email);
      if (error) {
        throw error;
      }

      toast.success("Registration successful! ");
      navigate(`/`);
    } catch (error) {
      setErr(false);
      toast.error(error.message);
    }
  };
  const insertUser = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("user")
        .insert([{ user_id: email }]);

      if (error) throw error;

      console.log("User inserted:", data);
    } catch (error) {
      console.error("Error inserting user:", error);
      setErr(true);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", alignItems:"center", minHeight:"100vh", flexDirection:"column" }}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader style={{ justifyContent: "center" }}>
            <h1>Register</h1>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex w-full flex-wrap sd:flex-nowrap gap-3">
              <Input
                type="email"
                value={email}
                isInvalid={err}
                label="Email"
                onChange={(ev) => setEmail(ev.target.value)}
                required
                placeholder="email"
              />
              <Input
                type="password"
                isInvalid={err}
                errorMessage={err && "Error user already exists or invalid password"}
                value={password}
                label="Password"
                onChange={(ev) => {
                  setPassword(ev.target.value);
                }}
                placeholder="password"
                required
              />
            </div>
          </CardBody>
          <CardFooter
            style={{ padding: "15px" }}
            className="flex w-full flex-wrap sd:flex-nowrap gap-3"
          >
            <Button type="submit">
              Submit
            </Button>
            <Button onClick={() => navigate("/")}>Cancel</Button>
            <Button onClick={() => navigate("/login")}>Login</Button>
          </CardFooter>
        </Card>
        </form>
      </div>

    </>
  );
}

export default Register;
