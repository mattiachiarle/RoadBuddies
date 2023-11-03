import { useContext, useState } from "react";
import AppContext from "../context/appContext";
import { Trip } from "../utils/types";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function CreateTrip({ email }) {
  const navigate = useNavigate();
  const supabase = useContext(AppContext);
  const [trip, setTrip] = useState<Trip>({
    id: 0,
    description: "",
    name: "",
    start_date: "",
    end_date: "",
    vehicle: "",
    start: "",
    destination: "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (trip) {
      setTrip({
        ...trip,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (trip) {
      const startDate = dayjs(trip.start_date);
      const endDate = dayjs(trip.end_date);
      if (startDate > endDate) {
        alert("Start date must be before end date");
        return;
      }
    }
    let { data, error } = await supabase
      .from("group")
      .insert({
        description: trip?.description,
        name: trip?.name,
        start_date: trip?.start_date,
        end_date: trip?.end_date,
        vehicle: trip?.vehicle,
        start: trip?.start,
        destination: trip?.destination,
      })
      .select();

    if (error) {
      console.error("Error inserting trip:", error);
    } else if (data) {
      console.log("Trip inserted successfully:", data);
    }

    const tripId = data[0].id;

    await supabase.from("trips").insert([{ group_id: tripId, user_id: email }]);

    navigate(`/`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>
              Name:
              <Form.Control
                type="text"
                name="name"
                value={trip.name}
                onChange={handleInputChange}
              />
            </Form.Label>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>
              Description:
              <Form.Control
                type="text"
                name="description"
                value={trip.description}
                onChange={handleInputChange}
              />
            </Form.Label>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>
              Start Date:
              <Form.Control
                type="date"
                name="start_date"
                value={trip.start_date}
                onChange={handleInputChange}
              />
            </Form.Label>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>
              End Date:
              <Form.Control
                type="date"
                name="end_date"
                value={trip.end_date}
                onChange={handleInputChange}
              />
            </Form.Label>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>
              Start Location:
              <Form.Control
                type="text"
                name="start"
                value={trip.start}
                onChange={handleInputChange}
              />
            </Form.Label>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>
              Destination:
              <Form.Control
                type="text"
                name="destination"
                value={trip.destination}
                onChange={handleInputChange}
              />
            </Form.Label>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>
              Vehicle:
              <Form.Select
                name="vehicle"
                onChange={(
                  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
                ) => handleInputChange(event)}
                value={trip.vehicle}
              >
                <option>{trip.vehicle}</option>
                <option>Car</option>
                <option>Motorbike</option>
                <option>Bicycle</option>
                <option>On foot</option>
                <option>Airplane</option>
                <option>Train</option>
              </Form.Select>
            </Form.Label>
          </Form.Group>
        </Col>
      </Row>
      <Button type="submit" value="Update Trip">
        Submit
      </Button>
    </Form>
  );
}

export default CreateTrip;
