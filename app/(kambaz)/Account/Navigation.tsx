// import Link from "next/link";
// export default function AccountNavigation() {
//  return (
//    <div id="wd-account-navigation">
//      <Link href="Signin"> Signin </Link> <br />
//      <Link href="Signup"> Signup </Link> <br />
//      <Link href="Profile"> Profile </Link> <br />
//    </div>
// );}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface AccountNavigationProps {
  activePage?: string;
}

export default function AccountNavigation({ activePage }: AccountNavigationProps) {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const pathname = usePathname();

  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];

  const getItemClass = (page: string) => {
    const name = page.toLowerCase();
    const isActive = activePage ? activePage === page : pathname?.endsWith(name);
    return `list-group-item border-0 ${isActive ? "wd-active text-black border-start border-4 border-black" : "text-danger"}`;
  };

  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      {links.includes("Signin") && (
        <Link href="/Account/Signin" id="wd-account-signin-link" className={getItemClass("Signin")}>
          <h5>Signin</h5>
        </Link>
      )}
      {links.includes("Signup") && (
        <Link href="/Account/Signup" id="wd-account-signup-link" className={getItemClass("Signup")}>
          <h5>Signup</h5>
        </Link>
      )}
      {links.includes("Profile") && (
        <Link href="/Account/Profile" id="wd-account-profile-link" className={getItemClass("Profile")}>
          <h5>Profile</h5>
        </Link>
      )}
    </div>
  );
}