import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {redirect} from "react-router-dom";

function NavigationBar(props: { email: string } | undefined) {
    const email = props && props.email;
    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">RoadBuddies</Navbar.Brand>
                <Nav className="ms-auto">
                    {email ? (
                        <Navbar.Text>
                            Hello, {email}
                        </Navbar.Text>
                    ) : (
                        <Button onClick={() => redirect('/login')} style={{ border: '1px solid white' }}>Login</Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}
export default NavigationBar;