import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

function EditParticipants() {
  const supabase = useContext(AppContext);
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState("");
  const { tripId } = useParams();

  useEffect(() => {
    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("user_id")
        .eq("group_id", tripId);
      if (error) {
        console.error("Error fetching participants:", error);
      } else if (data) {
        setParticipants(data.map(item => item.user_id));
      }
    };

    fetchParticipants();
  }, [supabase, tripId]);

  const handleNewParticipantChange = (event) => {
    setNewParticipant(event.target.value);
  };

  const handleNewParticipantSubmit = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase
      .from("trips")
      .insert([{ group_id: tripId, user_id: newParticipant }]);

    if (error) {
      console.error("Error adding participant:", error);
    } else if (data) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant("");
    }
  };

  const handleDeleteParticipant = async (participant) => {
    const { data, error } = await supabase
      .from("trips")
      .delete()
      .eq("group_id", tripId)
      .eq("user_id", participant);

    if (error) {
      console.error("Error deleting participant:", error);
    } else if (data) {
      setParticipants(participants.filter(p => p !== participant));
    }
  };

  return (
    <div>
      <h2>Edit Participants</h2>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>
            {participant}
            <Button onClick={() => handleDeleteParticipant(participant)}>Delete</Button>
          </li>
        ))}
      </ul>
      <Form onSubmit={handleNewParticipantSubmit}>
        <Form.Group>
          <Form.Control
            type="text"
            value={newParticipant}
            onChange={handleNewParticipantChange}
            placeholder="New participant"
          />
          <Button type="submit">Add</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default EditParticipants;