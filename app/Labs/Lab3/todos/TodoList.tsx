"use client";

import { ListGroup } from "react-bootstrap";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const todos: any[] = []; // local JSON disabled

  return (
    <>
      <h3>Todo List</h3>
      <ListGroup>
        {todos.map((todo, idx) => {
          return <TodoItem key={idx} todo={todo} />;
        })}
        {todos.length === 0 && (
          <li className="list-group-item text-muted">
            No todos loaded (Local data source removed).
          </li>
        )}
      </ListGroup>
      <hr />
    </>
  );
}
