import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { useParams } from "react-router-dom";
import { Todo } from "../utils/types";
import { Form, Button } from "react-bootstrap";
function EditToDo() {
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
  }, []);

  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleNewTodoSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from("todo")
      .insert([{ group_id: tripId, checked: false, content: newTodo }])
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
          t.id === todo.id ? { ...t, checked: !t.checked } : t
        )
      );
    }
  };

  return (
    <div>
      <h2>To-Do List</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span style={{ textDecoration: todo.checked ? "line-through" : "none" }}>
              {todo.content}
            </span>
            <input
              style = {{marginLeft: "10px"}}
              type="checkbox"
              checked={todo.checked}
              onChange={() => handleTodoToggle(todo)}
            /> 
            {/* is that right?Should it be a form? Not sure */}

          </li>
        ))}
      </ul>
      <Form onSubmit={handleNewTodoSubmit}>
        <Form.Group>
        <Form.Control 
          type="text"
          value={newTodo}
          onChange={handleNewTodoChange}
          placeholder="New to-do"
        />
        </Form.Group>
        <Form.Group>
          <Button type="submit">Add</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default EditToDo;