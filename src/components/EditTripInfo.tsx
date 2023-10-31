import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { Trip } from "../utils/types";
import { useParams } from "react-router-dom";
import { Button, Row, Col, Form } from "react-bootstrap";

function EditTripInfo() {
  const supabase = useContext(AppContext);
  const [trip, setTrip] = useState<Trip | null>();
  const { tripId } = useParams();
  useEffect(() => {
    const fetchTrip = async () => {
      const { data, error } = await supabase
        .from("group")
        .select("*")
        .eq("id", tripId);

      if (error) {
        console.error("Error fetching trip:", error);
      } else if (data) {
        setTrip(data);
      }
    };

    fetchTrip();
  }, [tripId]);

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

    const { data, error } = await supabase
      .from("group")
      .update(trip)
      .eq("id", tripId);

    if (error) {
      console.error("Error updating trip:", error);
    } else if (data) {
      console.log("Trip updated successfully:", data);
    }
  };

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>
              Start Date:
              <Form.Control
                type="date"
                name="startDate"
                value={trip.startDate}
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
                name="endDate"
                value={trip.endDate}
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
      <Button type="submit" value="Update Trip" >Submit</Button>
    </Form>
  );
}

export default EditTripInfo;
