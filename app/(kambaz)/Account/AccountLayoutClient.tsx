"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import KambazNavigation from "../Navigation";
import AccountNavigation from "./Navigation";

export default function AccountLayoutClient({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  const getActivePage = () => {
    if (pathname.includes("/Signin")) return "Signin";
    if (pathname.includes("/Signup")) return "Signup";
    if (pathname.includes("/Profile")) return "Profile";
    return "Signin";
  };

  return (
    <div className="d-flex">
      {/* <KambazNavigation /> */}
      <div style={{ marginLeft: "10px" }}>
        <AccountNavigation activePage={getActivePage()} />
      </div>
      <div className="flex-fill p-4" style={{ marginLeft: "250px" }}>
        {children}
      </div>
    </div>
  );
}
