"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import KambazNavigation from "../Navigation";
import AccountNavigation from "./Navigation";

export default function AccountLayoutClient({ children }: Readonly<{ children: ReactNode }>) {
  
  const pathname = usePathname();
  

  return (
    <div className="d-flex">
     
      <KambazNavigation />
      <div className="flex-fill p-4" style={{ marginLeft: "110px" }}>
        <AccountNavigation /> 
        {children}
      </div>
    </div>
  );
}