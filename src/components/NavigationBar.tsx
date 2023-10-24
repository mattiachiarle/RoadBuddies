import {Container, Nav, Navbar} from "react-bootstrap";

function NavigationBar() {
    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="#home">RoadBuddies</Navbar.Brand>
                <Nav className="me-auto">
                    {/*boh*/}
                </Nav>
            </Container>
        </Navbar>
    );
}
export default NavigationBar;