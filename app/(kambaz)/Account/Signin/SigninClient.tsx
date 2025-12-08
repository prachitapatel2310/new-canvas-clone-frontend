"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import * as client from "../client";

export default function SigninClient() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    setError(null);
    try {
      const user = await client.signin(credentials);
      if (user) {
        dispatch(setCurrentUser(user));
        router.push("/Dashboard");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("An unknown error occurred.");
      }
      console.error(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        minHeight: "100vh",
        width: "100%",
        paddingTop: "40px",
        paddingLeft: "40px",
      }}
    >
      <div
        id="wd-signin-screen"
        className="card shadow-sm p-4"
        style={{ width: 380 }}
      >
        <h2 className="mb-4">
          <b>Sign In</b>
        </h2>

        <FormControl
          value={credentials.username}
          onChange={(e) =>
            setCredentials({
              ...credentials,
              username: (e.target as HTMLInputElement).value,
            })
          }
          className="mb-3"
          placeholder="Username"
          id="wd-username"
        />

        <FormControl
          value={credentials.password}
          onChange={(e) =>
            setCredentials({
              ...credentials,
              password: (e.target as HTMLInputElement).value,
            })
          }
          className="mb-3"
          placeholder="Password"
          type="password"
          id="wd-password"
        />

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <Button
          onClick={signin}
          id="wd-signin-btn"
          className="w-100 mb-3"
          variant="primary"
        >
          Sign In
        </Button>

        <Link
          href="/Account/Signup"
          id="wd-signup-link"
          className="btn btn-outline-secondary w-100 mb-3"
        >
          Create Account
        </Link>

        <div className="text-muted small">
          <p className="mb-2">
            <b>Student Login:</b>
            <br />
            Username: <code>steve345</code>
            <br />
            Password: <code>pass345</code>
          </p>

          <p className="mb-0">
            <b>Teacher Login:</b>
            <br />
            Username: <code>maya1002</code>
            <br />
            Password: <code>pass1002</code>
          </p>
        </div>
      </div>
    </div>
  );
}