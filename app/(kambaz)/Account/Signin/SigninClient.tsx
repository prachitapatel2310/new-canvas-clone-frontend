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
        router.push("/(kambaz)/Dashboard");
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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%", marginTop: "-100px" }}>
      <div id="wd-signin-screen" className="card shadow-sm p-4" style={{ width: 380 }}>
        <h1 className="text-center mb-4"><b>Sign in</b></h1>

        <FormControl
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: (e.target as HTMLInputElement).value })}
          className="mb-3"
          placeholder="username"
          id="wd-username"
        />

        <FormControl
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: (e.target as HTMLInputElement).value })}
          className="mb-3"
          placeholder="password"
          type="password"
          id="wd-password"
        />

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <Button onClick={signin} id="wd-signin-btn" className="w-100 mb-2">
          Sign in
        </Button>

        <Link href="/(kambaz)/Account/Signup" id="wd-signup-link" className="btn btn-outline-primary w-100">
          Sign up
        </Link>

        <p>
          username: tony123
          <br />
          password: pass123
          <br />
          role: student
        </p>

        <p>
          username: alice890
          <br />
          password: pass890
          <br />
          role: professor
        </p>
      </div>
    </div>
  );
}
