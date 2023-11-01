import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { useParams } from "react-router-dom";
import { Todo } from "../utils/types";
import { Form, Button, Row } from "react-bootstrap";
import "../utils/css/todo.css";
function EditToDo({ email}) {
  const supabase = useContext(AppContext);
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [newTodo, setNewTodo] = useState("");
  const { tripId } = useParams();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todo")
        .select("*")
        .eq("group_id", tripId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching todos:", error);
      } else if (data) {
        setTodos(data);
      }
    };

    fetchTodos();
  }, [supabase, tripId, email]);

  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleNewTodoSubmit = async (event) => {
    event.preventDefault();
    if (newTodo.trim.length < 1) return;
    const { data, error } = await supabase
      .from("todo")
      .insert([{ group_id: tripId, checked: false, content: newTodo, user: email }])
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
        todos.map((t) => (t.id === todo.id ? { ...t, checked: !t.checked } : t))
      );
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
            <span style={{ marginLeft: "10px", color: "#D3D3D3" }}>
              {todo.user}
            </span>
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
