import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { useParams } from "react-router-dom";
import { Button, Dropdown, Form } from "react-bootstrap";

function AddTransaction() {
  const supabase = useContext(AppContext);
  const [participants, setParticipants] = useState([]);
  const [user, setUser] = useState([]);
  const [amount, setAmount] = useState(0);
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

    fetchParticipants();
  }, [supabase, tripId]);

  const handleAmountChange = (ev) => {
    setAmount(ev.target.value);
  };

  const handleNewTransactionSubmit = async (ev) => {
    ev.preventDefault();
    if (user && amount > 0) {
      const { data, error } = await supabase
        .from("transactions")
        .insert([{ group_id: tripId, user_id: user, amount: amount }]);

      if (error) {
        console.log(error);
      }
      setUser([]);
      setAmount(0);
    }
  };

  return (
    <div>
      <h2>Add transaction</h2>
      <Form onSubmit={handleNewTransactionSubmit}>
        <Form.Group className="d-flex align-items-center">
          <Form.Label>
            User:
            <Dropdown
              onSelect={(selectedUser) => setUser(selectedUser)}
              className="mr-2 w-100"
            >
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="w-100"
              >
                {user || "Select a user"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {participants.map((user) => (
                  <Dropdown.Item key={user} eventKey={user}>
                    {user}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Label>
          <Form.Label>
            Amount:
            <Form.Control
              type="text"
              name="amount"
              value={amount}
              onChange={handleAmountChange}
            />
          </Form.Label>
          <Button type="submit">Add</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default AddTransaction;
