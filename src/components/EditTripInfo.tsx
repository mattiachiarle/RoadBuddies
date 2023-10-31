import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import { Trip } from "../utils/types";
import { useParams } from 'react-router-dom';
import {Button, Row, Form} from "react-bootstrap";


function EditTripInfo() {
  const { supabase } = useAppContext();
  const [trip, setTrip] = useState<Trip | null>();
  const { tripId } = useParams();

  useEffect(() => {
    const fetchTrip = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq('id', tripId)
        .single();

      if (error) {
        console.error("Error fetching trip:", error);
      } else if (data) {
        setTrip(data);
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (trip) {
        setTrip({
          ...trip,
          [event.target.name]: event.target.value
        });
      }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from('trips')
      .update(trip)
      .eq('id', tripId);

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
      <label>
        Start Date:
        <input type="date" name="startDate" value={trip.startDate} onChange={handleInputChange} />
      </label>
    </Row>
    <Row>
      <label>
        End Date:
        <input type="date" name="endDate" value={trip.endDate} onChange={handleInputChange} />
      </label>
    </Row>
    <Row>
      <label>
        Vehicle:
        <Form.Select name="vehicle" onChange={handleInputChange} value={trip.vehicle} >
            <option>{trip.vehicle}</option>
            <option>Car</option>
            <option>Motorbike</option>
            <option>Bicycle</option>
            <option>On foot</option>
            <option>Airplane</option>
            <option>Train</option>
        </Form.Select>
      </label>
    </Row>
      <Button type="submit" value="Update Trip" />
    </Form>
  );
}

export default EditTripInfo;