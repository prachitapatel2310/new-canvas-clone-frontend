import { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import "./KambazNavigation.css";  // Import navigation CSS
import "./styles.css";             // Import general styles

export const metadata = {
  title: "Kambaz",
  description: "Learning Management System",
};

export default function KambazLayout({ 
  children 
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <KambazNavigation />
      <div id="wd-kambaz">
        <div className="wd-main-content-offset">
          {children}
        </div>
      </div>
    </>
  );
}