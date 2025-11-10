"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";

export default function SignupClient() {
  const [credentials, setCredentials] = useState<any>({
    username: "",
    password: "",
    passwordVerify: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signup = () => {
    setError(null);
    if (!credentials.username) {
      setError("Username is required");
      return;
    }
    if (!credentials.password) {
      setError("Password is required");
      return;
    }
    if (credentials.password !== credentials.passwordVerify) {
      setError("Passwords do not match");
      return;
    }
    // For now, just navigate to the profile page.
    router.push("/Account/Profile");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", marginLeft: "100px", marginTop: "-100px" }}>
      <div id="wd-signup-screen" className="card shadow-sm p-4" style={{ width: 380 }}>
        <h1 className="text-center mb-4">
          <b>Sign up</b>
        </h1>

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

        <FormControl
          value={credentials.passwordVerify}
          onChange={(e) => setCredentials({ ...credentials, passwordVerify: (e.target as HTMLInputElement).value })}
          className="mb-3"
          placeholder="verify password"
          type="password"
          id="wd-password-verify"
        />

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <Button onClick={signup} id="wd-signup-btn" className="w-100 mb-2">
          Sign up
        </Button>

        <Link href="/Account/Signin" id="wd-signin-link" className="btn btn-outline-primary w-100">
          Sign in
        </Link>

        {/* Keep the "Already have an account?" part as requested */}
        <div className="text-center mt-2">
          <Link href="/Account/Signin" className="small">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
