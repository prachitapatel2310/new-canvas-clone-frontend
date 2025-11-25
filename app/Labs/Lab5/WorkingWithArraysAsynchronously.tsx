// "use client";
// import React, { useState, useEffect } from "react";
// import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
// import { FaTrash, FaPlusCircle } from "react-icons/fa";
// import { TiDelete } from "react-icons/ti";
// import { FaPencil } from "react-icons/fa6";

// import * as client from "./client";
// export default function WorkingWithArraysAsynchronously() {
//     const [todos, setTodos] = useState<any[]>([]);
//     const fetchTodos = async () => {
//         const todos = await client.fetchTodos();
//         setTodos(todos);
//     };
//     const removeTodo = async (todo: any) => {
//         const updatedTodos = await client.removeTodo(todo);
//         setTodos(updatedTodos);
//     };
//     const createNewTodo = async () => {
//         const todos = await client.createNewTodo();
//         setTodos(todos);
//     };
//     const postNewTodo = async () => {
//         const newTodo = await client.postNewTodo({ title: "New Posted Todo", completed: false, });
//         setTodos([...todos, newTodo]);
//     };
//     const deleteTodo = async (todo: any) => {
//         try {
//             await client.deleteTodo(todo);
//             const newTodos = todos.filter((t) => t.id !== todo.id);
//             setTodos(newTodos);
//         } catch (error: any) {
//             console.log(error);
//             setErrorMessage(error.response.data.message);
//         }
//     };
//     const editTodo = (todo: any) => {
//         const updatedTodos = todos.map(
//             (t) => t.id === todo.id ? { ...todo, editing: true } : t);
//         setTodos(updatedTodos);
//     };
//     const [errorMessage, setErrorMessage] = useState(null);
//     const updateTodo = async (todo: any) => {
//         try {
//             await client.updateTodo(todo);
//             setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
//         } catch (error: any) {
//             setErrorMessage(error.response.data.message);
//         }
//     };

//     return (
//         <div id="wd-asynchronous-arrays">
//             <h3>Working with Arrays Asynchronously</h3>
//             {errorMessage && (<div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">{errorMessage}</div>)}
//             <h4>Todos  <FaPlusCircle onClick={createNewTodo} className="text-success float-end fs-3" />
//                 <FaPlusCircle onClick={postNewTodo} className="text-primary float-end fs-3 me-3" id="wd-post-todo" />
//                 <TiDelete onClick={() => deleteTodo(todos)} className="text-danger float-end me-2 fs-3" id="wd-delete-todo" />
//                 <FaPencil onClick={() => editTodo(todos)} className="text-primary float-end me-2 mt-1" />

//             </h4>
//             <ListGroup>
//                 {todos.map((todo) => (
//                     <ListGroupItem key={todo.id}>
//                         <FaTrash onClick={() => removeTodo(todo)}
//                             className="text-danger float-end mt-1" id="wd-remove-todo" />

//                         <input type="checkbox" className="form-check-input me-2"
//                             onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })} />
//                         {!todo.editing ? (todo.title) : (
//                             <FormControl className="w-50 float-start" defaultValue={todo.title}
//                                 onKeyDown={(e) => {
//                                     if (e.key === "Enter") {
//                                         updateTodo({ ...todo, editing: false });
//                                     }
//                                 }}
//                                 onChange={(e) =>
//                                     updateTodo({ ...todo, title: e.target.value })
//                                 }
//                             />
//                         )}

//                         <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
//                             {todo.title} </span>
//                     </ListGroupItem>
//                 ))}
//             </ListGroup> <hr />
//         </div>
//     );
// }

"use client";
import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import * as client from "./client";

export default function WorkingWithArraysAsynchronously() {
    const [todos, setTodos] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch todos on component load
    useEffect(() => {
        fetchTodos();
    }, []);

    // Fetch all todos from server
    const fetchTodos = async () => {
        try {
            const todos = await client.fetchTodos();
            setTodos(todos);
            setErrorMessage(null);
        } catch (error: any) {
            console.error("Error fetching todos:", error);
            setErrorMessage("Failed to fetch todos");
        }
    };

    // Remove todo (GET method - uses /delete endpoint)
    const removeTodo = async (todo: any) => {
        try {
            const updatedTodos = await client.removeTodo(todo);
            setTodos(updatedTodos);
            setErrorMessage(null);
        } catch (error: any) {
            console.error("Error removing todo:", error);
            setErrorMessage(error.response?.data?.message || "Failed to remove todo");
        }
    };

    // Delete todo (DELETE method - proper REST way)
    const deleteTodo = async (todo: any) => {
        try {
            await client.deleteTodo(todo);
            const newTodos = todos.filter((t) => t.id !== todo.id);
            setTodos(newTodos);
            setErrorMessage(null);
        } catch (error: any) {
            console.error("Error deleting todo:", error);
            setErrorMessage(error.response?.data?.message || "Failed to delete todo");
        }
    };

    // Create new todo (GET method - for testing)
    const createNewTodo = async () => {
        try {
            const updatedTodos = await client.createNewTodo();
            setTodos(updatedTodos);
            setErrorMessage(null);
        } catch (error: any) {
            console.error("Error creating todo:", error);
            setErrorMessage("Failed to create todo");
        }
    };

    // Post new todo (POST method - proper REST way)
    const postNewTodo = async () => {
        try {
            const newTodo = await client.postNewTodo({
                title: "New Posted Todo",
                completed: false,
            });
            setTodos([...todos, newTodo]);
            setErrorMessage(null);
        } catch (error: any) {
            console.error("Error posting todo:", error);
            setErrorMessage("Failed to create todo");
        }
    };

    // Enable edit mode for a todo
    const editTodo = (todo: any) => {
        const updatedTodos = todos.map((t) =>
            t.id === todo.id ? { ...t, editing: true } : t
        );
        setTodos(updatedTodos);
    };

    // Update todo (PUT method - proper REST way)
    const updateTodo = async (todo: any) => {
        try {
            await client.updateTodo(todo);
            const updatedTodos = todos.map((t) =>
                t.id === todo.id ? { ...todo, editing: false } : t
            );
            setTodos(updatedTodos);
            setErrorMessage(null);
        } catch (error: any) {
            console.error("Error updating todo:", error);
            setErrorMessage(error.response?.data?.message || "Failed to update todo");
        }
    };

    // Handle title change in edit mode
    const handleTitleChange = (todo: any, newTitle: string) => {
        const updatedTodos = todos.map((t) =>
            t.id === todo.id ? { ...t, title: newTitle } : t
        );
        setTodos(updatedTodos);
    };

    // Handle completed checkbox change
    const handleCompletedChange = (todo: any, completed: boolean) => {
        updateTodo({ ...todo, completed, editing: false });
    };

    // Handle enter key in edit mode
    const handleEditKeyPress = (e: React.KeyboardEvent, todo: any) => {
        if (e.key === "Enter") {
            updateTodo({ ...todo, editing: false });
        }
    };

    return (
        <div id="wd-asynchronous-arrays" className="container mt-4">
            <h3>Working with Arrays Asynchronously</h3>

            {/* Error Message */}
            {errorMessage && (
                <div
                    id="wd-todo-error-message"
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                >
                    {errorMessage}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setErrorMessage(null)}
                    ></button>
                </div>
            )}

            {/* Header with Action Buttons */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Todos ({todos.length})</h4>
                <div className="d-flex gap-2">
                    <FaPlusCircle
                        onClick={createNewTodo}
                        className="text-success cursor-pointer"
                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                        title="Create Todo (GET)"
                        id="wd-create-todo"
                    />
                    <FaPlusCircle
                        onClick={postNewTodo}
                        className="text-primary cursor-pointer"
                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                        title="Post New Todo (POST)"
                        id="wd-post-todo"
                    />
                </div>
            </div>

            {/* Todos List */}
            <ListGroup>
                {todos.length === 0 ? (
                    <ListGroupItem>No todos yet. Create one to get started!</ListGroupItem>
                ) : (
                    todos.map((todo) => (
                        <ListGroupItem key={todo.id} className="d-flex align-items-center gap-2">
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={todo.completed || false}
                                onChange={(e) =>
                                    handleCompletedChange(todo, e.target.checked)
                                }
                                style={{ cursor: "pointer" }}
                            />

                            {/* Title or Edit Input */}
                            {!todo.editing ? (
                                <span
                                    style={{
                                        textDecoration: todo.completed
                                            ? "line-through"
                                            : "none",
                                        flex: 1,
                                    }}
                                >
                                    {todo.title}
                                </span>
                            ) : (
                                <FormControl
                                    type="text"
                                    value={todo.title}
                                    onChange={(e) =>
                                        handleTitleChange(todo, e.target.value)
                                    }
                                    onKeyDown={(e) => handleEditKeyPress(e as any, todo)}
                                    onBlur={() => updateTodo({ ...todo, editing: false })}
                                    autoFocus
                                    className="flex-grow-1"
                                />
                            )}

                            {/* Edit Button */}
                            <FaPencil
                                onClick={() => editTodo(todo)}
                                className="text-primary cursor-pointer"
                                style={{ cursor: "pointer" }}
                                title="Edit todo"
                                id="wd-edit-todo"
                            />

                            {/* Remove Button (GET method) */}
                            <FaTrash
                                onClick={() => removeTodo(todo)}
                                className="text-warning cursor-pointer"
                                style={{ cursor: "pointer" }}
                                title="Remove todo (GET)"
                                id="wd-remove-todo"
                            />

                            {/* Delete Button (DELETE method) */}
                            <FaTrash
                                onClick={() => deleteTodo(todo)}
                                className="text-danger cursor-pointer"
                                style={{ cursor: "pointer" }}
                                title="Delete todo (DELETE)"
                                id="wd-delete-todo"
                            />

                            {/* ID Badge */}
                            <span className="badge bg-secondary">{todo.id}</span>
                        </ListGroupItem>
                    ))
                )}
            </ListGroup>
            <hr />
        </div>
    );
}