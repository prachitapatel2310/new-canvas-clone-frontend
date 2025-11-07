"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import type { RootState } from "@/lib/redux/store";
import { Button, FormControl } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Profile() {
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

  const signout = () => {
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", marginLeft: "-380px", marginTop: "-40px" }}>
      <div id="wd-profile-screen" className="card shadow-sm p-4" style={{ width: 380 }}>
        <h1 className="text-center mb-4"><b>Profile</b></h1>

        <FormControl
          defaultValue={profile.loginId}
          readOnly
          className="mb-3"
          placeholder="login id (read-only)"
          id="wd-loginId"
        />

        <FormControl
          value={profile.username ?? ""}
          onChange={(e) => setProfile({ ...profile, username: (e.target as HTMLInputElement).value })}
          className="mb-3"
          placeholder="username"
          id="wd-username"
        />

        <FormControl
          value={profile.firstName ?? ""}
          onChange={(e) => setProfile({ ...profile, firstName: (e.target as HTMLInputElement).value })}
          className="mb-3"
          placeholder="first name"
          id="wd-firstname"
        />

        <FormControl
          value={profile.lastName ?? ""}
          onChange={(e) => setProfile({ ...profile, lastName: (e.target as HTMLInputElement).value })}
          className="mb-3"
          placeholder="last name"
          id="wd-lastname"
        />

        <FormControl
          value={profile.section ?? ""}
          onChange={(e) => setProfile({ ...profile, section: (e.target as HTMLInputElement).value })}
          className="mb-3"
          placeholder="section (e.g. S101)"
          id="wd-section"
        />

        <select className="form-control mb-3" id="wd-role"
          value={profile.role ?? "USER"}
          onChange={(e) => setProfile({ ...profile, role: (e.target as HTMLSelectElement).value })} >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="TA">TA</option>
          <option value="STUDENT">Student</option>
        </select>

        <div className="mb-3 text-muted">
          <small><strong>Last activity:</strong> {profile.lastActivity ?? "-"} &nbsp; <strong>Total:</strong> {profile.totalActivity ?? "-"}</small>
        </div>

        <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
          Sign out
        </Button>
      </div>
    </div>
  );
}
