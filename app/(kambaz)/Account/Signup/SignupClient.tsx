"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { useState } from "react";
import * as db from "../../Database";
import { Form, Button } from "react-bootstrap";

export default function SignupClient() {
  const [model, setModel] = useState<any>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const signup = () => {
    setError(null);
    if (!model.username || !model.password) {
      setError("Username and password are required");
      return;
    }
    const exists = (db as any).users.some((u: any) => u.username === model.username);
    if (exists) {
      setError("Username already exists");
      return;
    }
    const user = { _id: `U${Date.now()}`, ...model, role: "USER" };
    (db as any).users.push(user);
    dispatch(setCurrentUser(user));
    router.push("/Dashboard");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="card p-4" style={{ width: 420 }}>
        <h2 className="mb-3">Sign up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form.Group className="mb-2">
          <Form.Control
            placeholder="username"
            value={model.username}
            onChange={(e) => setModel({ ...model, username: (e.target as HTMLInputElement).value })}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="password"
            placeholder="password"
            value={model.password}
            onChange={(e) => setModel({ ...model, password: (e.target as HTMLInputElement).value })}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            placeholder="First name"
            value={model.firstName}
            onChange={(e) => setModel({ ...model, firstName: (e.target as HTMLInputElement).value })}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            placeholder="Last name"
            value={model.lastName}
            onChange={(e) => setModel({ ...model, lastName: (e.target as HTMLInputElement).value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            placeholder="email"
            value={model.email}
            onChange={(e) => setModel({ ...model, email: (e.target as HTMLInputElement).value })}
          />
        </Form.Group>
        <Button onClick={signup} className="w-100">
          Create account
        </Button>
        <Link href="/Account/Signin" className="btn btn-link w-100 mt-2">
          Already have an account?
        </Link>
      </div>
    </div>
  );
}
