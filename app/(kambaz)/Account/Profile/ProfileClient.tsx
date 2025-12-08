"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import type { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";
import { useRouter } from "next/navigation";
import * as client from "../client";

export default function ProfileClient() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const router = useRouter();

  const fetchProfile = () => {
    if (!currentUser) {
      router.push("/Account/Signin");
      return;
    }
    setProfile(currentUser);
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };

  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        id="wd-profile-screen"
        className="card shadow-sm p-4"
        style={{ width: 380 }}
      >
        <h2 className="mb-4">
          <b>Profile</b>
        </h2>

        <FormControl
          defaultValue={profile.loginId}
          readOnly
          className="mb-3"
          placeholder="Login ID (read-only)"
          id="wd-loginId"
        />

        <FormControl
          value={profile.username ?? ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              username: (e.target as HTMLInputElement).value,
            })
          }
          className="mb-3"
          placeholder="Username"
          id="wd-username"
        />

        <FormControl
          value={profile.firstName ?? ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              firstName: (e.target as HTMLInputElement).value,
            })
          }
          className="mb-3"
          placeholder="First Name"
          id="wd-firstname"
        />

        <FormControl
          value={profile.lastName ?? ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              lastName: (e.target as HTMLInputElement).value,
            })
          }
          className="mb-3"
          placeholder="Last Name"
          id="wd-lastname"
        />

        <FormControl
          value={profile.section ?? ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              section: (e.target as HTMLInputElement).value,
            })
          }
          className="mb-3"
          placeholder="Section (e.g. S101)"
          id="wd-section"
        />

        <select
          className="form-control mb-3"
          id="wd-role"
          value={profile.role ?? "USER"}
          onChange={(e) =>
            setProfile({
              ...profile,
              role: (e.target as HTMLSelectElement).value,
            })
          }
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="TA">TA</option>
          <option value="STUDENT">Student</option>
        </select>

        <div className="mb-3 text-muted small">
          <strong>Last activity:</strong> {profile.lastActivity ?? "-"} 
          &nbsp;&nbsp;
          <strong>Total:</strong> {profile.totalActivity ?? "-"}
        </div>

        <Button
          onClick={updateProfile}
          className="w-100 mb-2"
          id="wd-update-profile-btn"
          variant="primary"
        >
          Update Profile
        </Button>

        <Button
          onClick={signout}
          className="w-100"
          id="wd-signout-btn"
          variant="outline-danger"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}