import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { useParams } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { IoPersonRemove } from "react-icons/io5";
// import { Form, Button, Dropdown } from "react-bootstrap";

function EditParticipants(email) {
  const supabase = useContext(AppContext);
  const [participants, setParticipants] = useState([]);
  const [users, setUsers] = useState([]);
  const [newParticipant, setNewParticipant] = useState<string>("");
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
  }, [supabase, tripId, newParticipant]);

  const handleNewParticipantSubmit = async () => {
    const { data, error } = await supabase
      .from("trips")
      .insert([{ group_id: tripId, user_id: newParticipant }])
      .select();

    if (error) {
      console.error("Error adding participant:", error);
    } else if (data) {
      setParticipants([...participants, newParticipant]);
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
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewParticipant(event.target.value);
  };
  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h2>Edit Participants</h2>
      {participants.map((participant, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          <div>{participant}</div>
          {email.email !== participant && (
            <IoPersonRemove
              style={{ color: "red", cursor: "pointer", fontSize: "22px" }}
              onClick={() => handleDeleteParticipant(participant)}
            />
          )}
        </div>
      ))}
      <div style={{display:"flex", flexDirection:"row"}}>
      <Select 
        label="Add Participant" 
        className="max-w-xs"
        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => handleInputChange(event)} 
      >
      {users
        .filter((user) => !participants.includes(user))
        .map((user, index) => (
          <SelectItem style={{color:"white"}} key={user} eventKey={user} value={user}>
            {user}
          </SelectItem>
        ))}
      </Select>
      </div>
      <div style={{display:"flex", flexDirection:"row"}}>
      <Button onClick={handleNewParticipantSubmit}>Add</Button>
      </div>
    </div>
  );
}

export default EditParticipants;
