"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import * as client from "../client";

export default function SignupClient() {
  const [credentials, setCredentials] = useState<any>({
    username: "",
    password: "",
    passwordVerify: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const signup = async () => {
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

    try {
      const user = await client.signup({
        username: credentials.username,
        password: credentials.password
      });
      
      if (user) {
        dispatch(setCurrentUser(user));
        router.push("/Dashboard");
      }
    } catch (err: any) {
      if (err?.response?.status === 400) {
        setError(err.response.data.message || "Username already in use");
      } else {
        setError("An error occurred during signup. Please try again.");
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
        id="wd-signup-screen"
        className="card shadow-sm p-4"
        style={{ width: 380 }}
      >
        <h2 className="mb-4">
          <b>Sign Up</b>
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

        <FormControl
          value={credentials.passwordVerify}
          onChange={(e) =>
            setCredentials({
              ...credentials,
              passwordVerify: (e.target as HTMLInputElement).value,
            })
          }
          className="mb-3"
          placeholder="Verify Password"
          type="password"
          id="wd-password-verify"
        />

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <Button
          onClick={signup}
          id="wd-signup-btn"
          className="w-100 mb-3"
          variant="primary"
        >
          Create Account
        </Button>

        <Link
          href="/Account/Signin"
          id="wd-signin-link"
          className="btn btn-outline-secondary w-100 mb-3"
        >
          Sign In
        </Link>

        <div className="text-center">
          <Link href="/Account/Signin" className="small text-muted">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}