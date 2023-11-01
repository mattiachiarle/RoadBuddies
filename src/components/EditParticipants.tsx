import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { useParams } from "react-router-dom";
import { Form, Button, Dropdown } from "react-bootstrap";

function EditParticipants() {
  const supabase = useContext(AppContext);
  const [participants, setParticipants] = useState([]);
  const [users, setUsers] = useState([]);
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
        setParticipants(data.map((item) => item.user_id));
      }
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase.from("user").select("user_id");
      if (error) {
        console.error("Error fetching users:", error);
      } else if (data) {
        setUsers(data.map((item) => item.user_id));
      }
    };

    fetchParticipants();
    fetchUsers();
  }, [supabase, tripId]);

  const handleNewParticipantSubmit = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase
      .from("trips")
      .insert([{ group_id: tripId, user_id: newParticipant }])
      .select();

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
      .eq("user_id", participant)
      .select();

    if (error) {
      console.error("Error deleting participant:", error);
    } else if (data) {
      setParticipants(participants.filter((p) => p !== participant));
    }
  };

  return (
    <div>
      <h2>Edit Participants</h2>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>
            <Button onClick={() => handleDeleteParticipant(participant)}>
              Delete
            </Button>
            {participant}
          </li>
        ))}
      </ul>
      <Form onSubmit={handleNewParticipantSubmit}>
        <Form.Group className="d-flex align-items-center">
          <Dropdown
            onSelect={(selectedUser) => setNewParticipant(selectedUser)}
            className="mr-2 w-50"
          >
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              className="w-100"
            >
              {newParticipant || "Select a user"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {users
                .filter((user) => !participants.includes(user))
                .map((user) => (
                  <Dropdown.Item key={user} eventKey={user}>
                    {user}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button type="submit">Add</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default EditParticipants;
