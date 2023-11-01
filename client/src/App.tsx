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
import AddTransaction from "./components/AddTransaction.tsx";

import AppContext, { AppContextProvider } from "./context/appContext.tsx";
import { useContext, useEffect, useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const supabase = useContext(AppContext);

  useEffect(() => {
    const getSession = async () => {
      const session = await supabase.auth.getSession();
      if (session.data.session != undefined) {
        setEmail(session.data.session.user.email);
      }
    };
    getSession();
  }, []);

  const updateEmail = (email: string) => {
    setEmail(email);
  };

  return (
    <>
      <AppContextProvider>
        <BrowserRouter>
          <Container fluid className="App">
            <Row>
              <NavigationBar email={email} updateEmail={updateEmail} />
            </Row>
            <Row>
              <Col>
                <Routes>
                  <Route
                    path="/"
                    element={<DefaultLayout userEmail={email} />}
                  />{" "}
                  {/*here the list of trips?*/}
                  <Route path="/trips/:tripId/" element={<Trip />}>
                    {" "}
                    {/*here the trip sidebar?*/}
                    <Route index element={<TripInfo email={email} />} />
                    <Route
                      path="editParticipants"
                      element={<EditParticipants />}
                    />{" "}
                    {/*here the edit participants?*/}
                    <Route path="editInfo" element={<EditTripInfo />} />{" "}
                    <Route path="chat" element={<Chat email={email} />} />{" "}
                    {/*here the edit form?*/}
                    <Route
                      path="editToDo"
                      element={<EditToDo email={email} />}
                    />{" "}
                    <Route path="addTransaction" element={<AddTransaction />} />{" "}
                    {/*here the edit route?*/}
                  </Route>
                  <Route
                    path="/login"
                    element={<Login email={email} updateEmail={updateEmail} />}
                  />{" "}
                  {/*here the login form?*/}
                  <Route path="/register" element={<Register />} />{" "}
                  {/*here the register form?*/}
                </Routes>
              </Col>
            </Row>
          </Container>
        </BrowserRouter>
      </AppContextProvider>
    </>
  );
}

export default App;