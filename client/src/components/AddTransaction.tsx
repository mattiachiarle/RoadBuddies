import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { useParams } from "react-router-dom";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";

function AddTransaction() {
  const supabase  = useContext(AppContext);
  const [participants, setParticipants] = useState([]);
  const [user, setUser] = useState<string>("");
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
        console.log(data)
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
      const { error } = await supabase
        .from("transactions")
        .insert([{ group_id: tripId, user_id: user, amount: amount }]);

      if (error) {
        console.log(error);
      }
      setUser("");
      setAmount(0);
    }
  };

  return (
    <div style={{color:"white", display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem"}}  >
      <h2 >Add transaction</h2>
      <div style={{display:"flex", flexDirection:"row"}}>
        <Input 
          type="number" 
          placeholder="0,00" 
          min="0"
          variant="underlined"
          value={amount}
          onChange={handleAmountChange}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
         />
      </div>
      <span>Who paid?</span>
        <Select 
          label="Add Participant" 
          className="max-w-xs"
          onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setUser(event.target.value)} 
        >
        {participants.map((user, index) => (
            <SelectItem style={{color:"white"}} key={user} value={user}>
              {user}
            </SelectItem>
          ))}
        </Select>
        <Button color="success" variant="ghost" onClick={handleNewTransactionSubmit}>Add</Button>
      {/* <Form onSubmit={handleNewTransactionSubmit}>
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
      </Form> */}
    </div>
  );
}

export default AddTransaction;
