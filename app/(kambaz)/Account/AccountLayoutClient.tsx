"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import KambazNavigation from "../Navigation";
import AccountNavigation from "./Navigation";

export default function AccountLayoutClient({ children }: Readonly<{ children: ReactNode }>) {
  // Removed pathname and getActivePage logic as AccountNavigation handles this internally.
  const pathname = usePathname();
  // Removed const getActivePage = () => { ... } as it is no longer needed.

  return (
    <div className="d-flex">
      {/* UNCOMMENT THIS LINE */}
      <KambazNavigation />
      
      {/* REMOVE OR COMMENT OUT these lines */}
      {/* <div style={{ marginLeft: "10px" }}>
        <AccountNavigation activePage={getActivePage()} />
      </div> */}
      
      {/* Keep the content area but adjust margin for sidebar */}
      <div className="flex-fill p-4" style={{ marginLeft: "110px" }}>
        {/* FIX: Removed activePage={getActivePage()} prop */}
        <AccountNavigation /> 
        {children}
      </div>
    </div>
  );
}