import { useAppContext } from "../context/appContext";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-toastify';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();
    const { supabase } = useAppContext();

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent the form from submitting the traditional way
        try {
            setErr("");
            const { user, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                throw error;
            }

            toast.success("Registration successful! ");
            navigate(`/`);
        } catch (error: any) {
            setErr(error.message);
            toast.error(error.message);
        }
    };

    return (
        <>
            {err && (
                <Card style={{ backgroundColor: "lightblue" }}>
                    <Card.Body>
                        <Card.Title style={{ color: 'red' }}>Error</Card.Title>
                        <Card.Text style={{ color: 'blue' }} onClick={() => setErr("")}>
                            {err}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Button variant="success" type="submit">
                        REGISTER
                    </Button>{' '}
                    <Button variant="success" onClick={() => navigate("/")}>
                        CANCEL
                    </Button>{' '}
                </Form.Group>
            </Form>
        </>
    );
}

export default Register;