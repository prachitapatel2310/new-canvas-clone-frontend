"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import type { Lab4RootState } from "../../store";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";

export default function TodoForm() {
  const { todo } = useSelector((state: Lab4RootState) => state.todosReducer ?? { todo: { id: "-1", title: "" } });
  const dispatch = useDispatch();
  return (
    <ListGroupItem className="d-flex align-items-center">
      <input
        className="form-control me-3 flex-grow-1"
        value={todo?.title ?? ""}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
      />
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-warning text-nowrap"
          onClick={() => dispatch(updateTodo(todo))}
          id="wd-update-todo-click"
        >
          Update
        </button>
        <button
          type="button"
          className="btn btn-success text-nowrap"
          onClick={() => dispatch(addTodo(todo))}
          id="wd-add-todo-click"
        >
          Add
        </button>
      </div>
    </ListGroupItem>
  );
}
