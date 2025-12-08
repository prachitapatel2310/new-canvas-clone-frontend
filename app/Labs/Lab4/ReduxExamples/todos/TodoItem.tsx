"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo, toggleTodoDone } from "./todosReducer";
import { ListGroupItem } from "react-bootstrap";

export default function TodoItem({ todo }: { todo: { id: string; title: string; done?: boolean } }) {
  const dispatch = useDispatch();
  return (
    <ListGroupItem className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <input
          type="checkbox"
          className="form-check-input me-2"
          checked={!!todo.done}
          onChange={() => dispatch(toggleTodoDone(todo.id))}
        />
        <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
          {todo.title}
        </span>
      </div>
      <div>
        <button
          className="btn btn-primary me-2 text-nowrap"
          onClick={() => dispatch(setTodo(todo))}
          id="wd-set-todo-click"
        >
          Edit
        </button>
        <button
          className="btn btn-danger text-nowrap"
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
        >
          Delete
        </button>
      </div>
    </ListGroupItem>
  );
}
