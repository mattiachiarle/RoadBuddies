import { useEffect, useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

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
import Register from "./components/Register.ts";
function App() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("DESCRIPTION.md")
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <>
      <BrowserRouter>
        <Container fluid className="App">
          <ReactMarkdown children={content} />
          <Row>
            <NavigationBar />
          </Row>
          <Row>
            <Col>
              <Routes>
                <Route path="/" element={<DefaultLayout />}>
                  {" "}
                  {/*here the list of trips?*/}
                  <Route index element={<DefaultLayout />} />
                  <Route path="/trips/:tripId/" element={<Trip />}>
                    {" "}
                    {/*here the trip sidebar?*/}
                    <Route index element={<TripInfo />} />
                    <Route
                      path="editParticipants"
                      element={<EditParticipants />}
                    />{" "}
                    {/*here the edit participants?*/}
                    <Route path="editInfo" element={<EditTripInfo />} />{" "}
                    <Route path="char" element={<Chat />} />{" "}
                    {/*here the edit form?*/}
                    <Route path="editToDo" element={<EditToDo />} />{" "}
                    {/*here the edit route?*/}
                  </Route>
                  <Route path="login" element={<Login />} />{" "}
                  {/*here the login form?*/}
                  <Route path="register" element={<Register />} />{" "}
                  {/*here the register form?*/}
                </Route>
              </Routes>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </BrowserRouter>
    </>
  );
}

export default App;
