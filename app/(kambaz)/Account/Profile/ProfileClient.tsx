"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import type { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";

export default function ProfileClient() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/Account/Signin");
      return;
    }
    setProfile(currentUser);
  }, [currentUser, router]);

  const signout = () => {
    dispatch(setCurrentUser(null));
    router.replace("/Account/Signin");
  };

  if (!profile) return null;

  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>
      <FormControl id="wd-username" className="mb-2" value={profile.username || ""} onChange={(e) => setProfile({ ...profile, username: (e.target as HTMLInputElement).value })} />
      <FormControl id="wd-password" className="mb-2" value={profile.password || ""} onChange={(e) => setProfile({ ...profile, password: (e.target as HTMLInputElement).value })} />
      <FormControl id="wd-firstname" className="mb-2" value={profile.firstName || ""} onChange={(e) => setProfile({ ...profile, firstName: (e.target as HTMLInputElement).value })} />
      <FormControl id="wd-lastname" className="mb-2" value={profile.lastName || ""} onChange={(e) => setProfile({ ...profile, lastName: (e.target as HTMLInputElement).value })} />
      <FormControl id="wd-dob" className="mb-2" type="date" value={profile.dob || ""} onChange={(e) => setProfile({ ...profile, dob: (e.target as HTMLInputElement).value })} />
      <FormControl id="wd-email" className="mb-2" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: (e.target as HTMLInputElement).value })} />
      <select className="form-control mb-2" id="wd-role" value={profile.role || "USER"} onChange={(e) => setProfile({ ...profile, role: (e.target as HTMLSelectElement).value })}>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </select>
      <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn"> Sign out </Button>
    </div>
  );
}
