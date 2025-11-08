"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as db from "../../Database";
import { FormControl, Button } from "react-bootstrap";

export default function SigninClient() {
  const [credentials, setCredentials] = useState<any>({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = () => {
    setError(null);
    const user = (db as any).users.find(
      (u: any) => u.username === credentials.username && u.password === credentials.password
    );
    if (!user) {
      setError("Invalid username or password");
      return;
    }
    dispatch(setCurrentUser(user));
    router.push("/Dashboard");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
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

        <Link href="/Account/Signup" id="wd-signup-link" className="btn btn-outline-primary w-100">
          Sign up
        </Link>

        <p className="mt-3 small text-muted">
          username: tony123 / password: pass123 (student)
          <br />
          username: alice890 / password: pass890 (professor)
        </p>
      </div>
    </div>
  );
}
