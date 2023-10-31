
import NavigationBar from "./components/NavigationBar.tsx";
import { Col, Container, Row } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout.tsx";
import Trip from "./components/Trip.tsx";
import TripInfo from "./components/TripInfo.tsx";
import EditParticipants from "./components/EditParticipants.tsx";
import EditTripInfo from "./components/EditTripInfo.tsx";
import EditToDo from "./components/EditToDo.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import Chat from "./components/Chat.tsx";

import { AppContextProvider } from "./context/appContext.tsx";
import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");

  return (
    <>
      <BrowserRouter>
        <Container fluid className="App">
          <Row>
            <NavigationBar />
          </Row>
          <Row>
            <Col>
              <Routes>
                <Route path="/" element={<DefaultLayout userEmail={email} />}>
                  {" "}
                  {/*here the list of trips?*/}

                  <Route path="trips/:tripId/" element={<Trip />}>
                    {" "}
                    {/*here the trip sidebar?*/}
                    <Route index element={<TripInfo />} />
                    <Route
                      path="editParticipants"
                      element={<EditParticipants />}
                    />{" "}
                    {/*here the edit participants?*/}
                    <Route path="editInfo" element={<EditTripInfo />} />{" "}
                    <Route path="chat" element={<Chat />} />{" "}
                    {/*here the edit form?*/}
                    <Route path="editToDo" element={<EditToDo />} />{" "}
                    {/*here the edit route?*/}
                  </Route>
                </Route>
                <Route path="/login" element={<Login />} />{" "}
                {/*here the login form?*/}
                <Route path="/register" element={<Register />} />{" "}
                {/*here the register form?*/}
              </Routes>
            </Col>

          </Row>
        </Container>
      </BrowserRouter>
    </>
  );
}

export default App;
