"use client";

import { ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import KambazNavigation from "./Navigation";
import "./KambazNavigation.css";
import "./styles.css";

export default function KambazLayout({ 
  children 
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <div id="wd-kambaz">
        <div className="wd-main-content-offset">
          {children}
        </div>
      </div>
    </>
  );
}
