"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithArrays() {
    const [todo, setTodo] = useState({
        id: "1",
        title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-09-09",
        completed: false,
    });

    const API = `${HTTP_SERVER}/lab5/todos`;

    return (
        <div id="wd-working-with-arrays" className="container mt-4">
            <h3 className="mb-4">Working with Arrays (Synchronous)</h3>

            {/* 5.2.4.1: Retrieving Arrays */}
            <div className="mb-5">
                <h4>Retrieving Arrays</h4>
                <p className="text-muted small">Fetch all todos from the server</p>
                <a 
                    id="wd-retrieve-todos" 
                    className="btn btn-primary" 
                    href={API}
                >
                    Get Todos
                </a>
                <hr />
            </div>

            {/* 5.2.4.2: Retrieving an Item from an Array by ID */}
            <div className="mb-5">
                <h4>Retrieving an Item from an Array by ID</h4>
                <p className="text-muted small">Fetch a specific todo by its ID</p>
                <div className="d-flex gap-2 align-items-end">
                    <div className="flex-grow-1">
                        <label htmlFor="wd-todo-id" className="form-label">
                            Todo ID
                        </label>
                        <FormControl 
                            id="wd-todo-id" 
                            value={todo.id}
                            onChange={(e) => setTodo({ ...todo, id: e.target.value })} 
                            className="w-50"
                        />
                    </div>
                    <a 
                        id="wd-retrieve-todo-by-id" 
                        className="btn btn-primary" 
                        href={`${API}/${todo.id}`}
                    >
                        Get Todo by ID
                    </a>
                </div>
                <hr />
            </div>

            {/* 5.2.4.3: Filtering Array Items (Query Parameters) */}
            <div className="mb-5">
                <h4>Filtering Array Items</h4>
                <p className="text-muted small">Fetch only completed todos using query parameters</p>
                <a 
                    id="wd-retrieve-completed-todos" 
                    className="btn btn-primary"
                    href={`${HTTP_SERVER}/lab5/todos?completed=true`}
                >
                    Get Completed Todos
                </a>
                <hr />
            </div>

            {/* 5.2.4.4: Creating new Items in an Array */}
            <div className="mb-5">
                <h4>Creating new Items in an Array</h4>
                <p className="text-muted small">Create a new todo on the server</p>
                <a 
                    id="wd-create-todo-link" 
                    className="btn btn-success" 
                    href={`${HTTP_SERVER}/lab5/todos/create`}
                >
                    Create Todo
                </a>
                <hr />
            </div>

            {/* 5.2.4.5: Removing from an Array */}
            <div className="mb-5">
                <h4>Removing from an Array</h4>
                <p className="text-muted small">Delete a todo by its ID</p>
                <div className="d-flex gap-2 align-items-end">
                    <div className="flex-grow-1">
                        <label htmlFor="wd-remove-id" className="form-label">
                            Todo ID to Remove
                        </label>
                        <FormControl 
                            id="wd-remove-id"
                            value={todo.id} 
                            className="w-50" 
                            onChange={(e) => setTodo({ ...todo, id: e.target.value })} 
                        />
                    </div>
                    <a 
                        id="wd-remove-todo" 
                        className="btn btn-danger" 
                        href={`${API}/${todo.id}/delete`}
                    >
                        Remove Todo
                    </a>
                </div>
                <hr />
            </div>

            {/* 5.2.4.6: Updating an Item in an Array (Title) */}
            <div className="mb-5">
                <h4>Updating an Item in an Array</h4>
                <p className="text-muted small">Update todo title by ID</p>
                <div className="d-flex gap-2 align-items-end mb-3">
                    <div style={{ width: "200px" }}>
                        <label htmlFor="wd-update-id" className="form-label">
                            Todo ID
                        </label>
                        <FormControl 
                            id="wd-update-id"
                            value={todo.id} 
                            className="w-100"
                            onChange={(e) => setTodo({ ...todo, id: e.target.value })} 
                        />
                    </div>
                    <div className="flex-grow-1">
                        <label htmlFor="wd-update-title" className="form-label">
                            New Title
                        </label>
                        <FormControl 
                            id="wd-update-title"
                            value={todo.title} 
                            className="w-100"
                            onChange={(e) => setTodo({ ...todo, title: e.target.value })} 
                        />
                    </div>
                    <a 
                        id="wd-update-todo-title"
                        href={`${API}/${todo.id}/title/${encodeURIComponent(todo.title)}`} 
                        className="btn btn-info"
                    >
                        Update Title
                    </a>
                </div>
                <hr />
            </div>

            {/* 5.2.4.7: On Your Own (Update description & completed) */}
            <div className="mb-5">
                <h4>On Your Own (Update description & completed)</h4>
                <p className="text-muted small">Update todo description and completion status</p>

                {/* Update Description */}
                <div className="mb-3">
                    <label htmlFor="wd-update-description-input" className="form-label">
                        Update Description
                    </label>
                    <div className="d-flex gap-2 align-items-end">
                        <div className="flex-grow-1">
                            <FormControl 
                                id="wd-update-description-input"
                                value={todo.description} 
                                className="w-100"
                                onChange={(e) => setTodo({ ...todo, description: e.target.value })} 
                            />
                        </div>
                        <a 
                            id="wd-update-description" 
                            className="btn btn-warning"
                            href={`${HTTP_SERVER}/lab5/todos/${todo.id}/description/${encodeURIComponent(todo.description)}`}
                        >
                            Update Description
                        </a>
                    </div>
                </div>

                {/* Update Completed Status */}
                <div className="mb-3">
                    <div className="form-check">
                        <input 
                            type="checkbox" 
                            id="wd-todo-completed-check"
                            checked={todo.completed}
                            className="form-check-input"
                            onChange={(e) => setTodo({ ...todo, completed: e.target.checked })} 
                        />
                        <label htmlFor="wd-todo-completed-check" className="form-check-label">
                            Mark as Completed
                        </label>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <a 
                        id="wd-update-completed" 
                        className="btn btn-primary"
                        href={`${HTTP_SERVER}/lab5/todos/${todo.id}/completed/${todo.completed}`}
                    >
                        Update Completed Status (ID = {todo.id})
                    </a>
                </div>
                <hr />
            </div>
        </div>
    );
}