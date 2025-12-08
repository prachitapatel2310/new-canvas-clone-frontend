

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const pathname = usePathname() ?? "";

  const baseLinks = currentUser ? ["Profile"] : ["Signin", "Signup"];
  
  if (currentUser && currentUser.role === "ADMIN") {
    baseLinks.push("Users");
  }

  return (
    <div
      className="wd list-group fs-5 rounded-0 p-0 m-0"
      style={{ width: 140, marginLeft: 0, paddingLeft: 0 }}
    >
      {/* Signin Link */}
      {baseLinks.includes("Signin") && (
        <Link
          href="/Account/Signin"
          id="wd-account-signin-link"
          className={`list-group-item border-0 ps-0 pe-0 ms-0 me-0 ${
            pathname.startsWith("/Account/Signin")
              ? "wd-active text-black border-start border-4 border-black"
              : "text-danger"
          }`}
          style={{ paddingLeft: 0, marginLeft: 0 }}
        >
          Signin
        </Link>
      )}

      {/* Signup Link */}
      {baseLinks.includes("Signup") && (
        <Link
          href="/Account/Signup"
          id="wd-account-signup-link"
          className={`list-group-item border-0 ps-0 pe-0 ms-0 me-0 ${
            pathname.startsWith("/Account/Signup")
              ? "wd-active text-black border-start border-4 border-black"
              : "text-danger"
          }`}
          style={{ paddingLeft: 0, marginLeft: 0 }}
        >
          Signup
        </Link>
      )}

      {/* Profile Link */}
      {baseLinks.includes("Profile") && (
        <Link
          href="/Account/Profile"
          id="wd-account-profile-link"
          className={`list-group-item border-0 ps-0 pe-0 ms-0 me-0 ${
            pathname.startsWith("/Account/Profile")
              ? "wd-active text-black border-start border-4 border-black"
              : "text-danger"
          }`}
          style={{ paddingLeft: 0, marginLeft: 0 }}
        >
          Profile
        </Link>
      )}

      {/* Users Link (Admin Only) */}
      {baseLinks.includes("Users") && (
        <Link
          href="/Account/Users"
          id="wd-account-users-link"
          className={`list-group-item border-0 ps-0 pe-0 ms-0 me-0 ${
            pathname.startsWith("/Account/Users")
              ? "wd-active text-black border-start border-4 border-black"
              : "text-danger"
          }`}
          style={{ paddingLeft: 0, marginLeft: 0 }}
        >
          Users
        </Link>
      )}
    </div>
  );
}