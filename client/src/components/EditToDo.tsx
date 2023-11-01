import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { useParams } from "react-router-dom";
import { Todo } from "../utils/types";
import { Form, Button, Row, Dropdown } from "react-bootstrap";
import "../utils/css/todo.css";
function EditToDo({ email }) {
  const supabase = useContext(AppContext);
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [newTodo, setNewTodo] = useState("");
  const [participants, setParticipants] = useState<Array<string>>([]);
  const { tripId } = useParams();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todo")
        .select("*")
        .eq("group_id", tripId)
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error fetching todos:", error);
      } else if (data) {
        setTodos(data);
      }
      const { data: participantData, error: participantError } = await supabase
        .from("trips")
        .select("user_id")
        .eq("group_id", tripId);

      if (participantError) {
        console.error("Error fetching participants:", participantError);
      } else if (participantData) {
        // Assuming that the user_id is the participant
        const participants = participantData.map(
          (participant) => participant.user_id,
        );
        setParticipants(participants);
      }
    };

    fetchTodos();
  }, [supabase, tripId, email]);

  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleNewTodoSubmit = async (event) => {
    event.preventDefault();
    console.log(newTodo.trim);
    if (newTodo.trim() == "") {
      alert("Please enter a NON-empty todo");
      return;
    }
    const { data, error } = await supabase
      .from("todo")
      .insert([
        { group_id: tripId, checked: false, content: newTodo, user: null },
      ])
      .select();

    if (error) {
      console.error("Error adding todo:", error);
    } else if (data) {
      setTodos([...todos, data[0]]);
      setNewTodo("");
    }
  };

  const handleTodoToggle = async (todo) => {
    const { data, error } = await supabase
      .from("todo")
      .update({ checked: !todo.checked })
      .eq("id", todo.id)
      .select();

    if (error) {
      console.error("Error updating todo:", error);
    } else if (data) {
      setTodos(
        todos.map((t) =>
          t.id === todo.id ? { ...t, checked: !t.checked } : t,
        ),
      );
    }
  };
  const handleUserSelect = async (selectedUser, todoId) => {
    const { error } = await supabase
      .from("todo")
      .update({ user: selectedUser })
      .eq("id", todoId)
      .select();

    if (error) {
      console.error("Error updating todo:", error);
    } else {
      // Update the local state if necessary
      const updatedTodos = todos.map((todo) =>
        todo.id === todoId ? { ...todo, user: selectedUser } : todo,
      );
      setTodos(updatedTodos);
    }
  };
  return (
    <div className="uniqueTodoList">
      <h2>To-Do List</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.checked ? "line-through" : "none" }}
            >
              {todo.content}
            </span>
            <Dropdown
              onSelect={(selectedUser) =>
                handleUserSelect(selectedUser, todo.id)
              }
            >
              <Dropdown.Toggle
                style={{
                  backgroundColor: "transparent",
                  marginLeft: "10px",
                  color: "#D3D3D3",
                }}
                variant="success"
                id="dropdown-basic"
              >
                {todo.user ? todo.user : "click here to assign"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {participants.map((participant) => (
                  <Dropdown.Item key={participant} eventKey={participant}>
                    {participant}
                  </Dropdown.Item>
                ))}
                <Dropdown.Item key={undefined} eventKey={undefined}>
                  unassign
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <input
              style={{ marginLeft: "10px" }}
              type="checkbox"
              checked={todo.checked}
              onChange={() => handleTodoToggle(todo)}
            />
            {/* is that right?Should it be a form? Not sure */}
          </li>
        ))}
      </ul>
      <Form onSubmit={handleNewTodoSubmit}>
        <Row>
          <Form.Group style={{ padding: "0" }} className="inputButtonContainer">
            <Form.Control
              className="innerInput"
              style={{ width: "82%", border: "none" }}
              type="text"
              value={newTodo}
              onChange={handleNewTodoChange}
              placeholder="New to-do"
            />
            <Button className="innerButton" type="submit">
              Add
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </div>
  );
}

export default EditToDo;
