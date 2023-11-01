import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import {Button, Col, Row} from "react-bootstrap";

function Trip() {
  const navigate = useNavigate();
  const { tripId } = useParams();

  return (
      <>
      <Row>
          <Col>
              <div className="sidebar" xs={3}>
                  {/* Sidebar content goes here */}
                  <Row>
                      <Button onClick={() => navigate(`editInfo`)} variant="primary" style={{ border: '1px solid black' }}>
                          Edit Info
                      </Button>
                    </Row>
                  <Row>
                      <Button onClick={() => navigate(`chat`)} variant="primary" style={{ border: '1px solid black' }}>
                          Chat
                      </Button>
                  </Row>
                  <Row>
                      <Button onClick={() => navigate(`editToDo`)} variant="primary" style={{ border: '1px solid black' }}>
                          Edit To-Do
                      </Button>
                  </Row>
                  <Row>
                      <Button onClick={() => navigate(`editParticipants`)} variant="primary" style={{ border: '1px solid black' }}>
                          Edit Participants
                      </Button>
                  </Row>
                  <Row>
                      <Button onClick={() => navigate(``)} variant="primary" style={{ border: '1px solid black' }}>
                          Info
                      </Button>
                  </Row>

              </div>
          </Col>
          <Col xs={9}>
              <Outlet /> {/* This will render the child routes */}
          </Col>
      </Row>
      </>

  );
}

export default Trip;
