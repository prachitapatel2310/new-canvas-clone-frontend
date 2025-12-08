import { ReactNode } from "react";
import "../styles.css";
import KambazNavigation from "../Navigation";


export default function Calendar({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-kambaz-calendar">
      <KambazNavigation />
      <div
        className="wd-main-content-offset"
        // shift content to the right of the left sidebar; adjust 120px if needed
        style={{ marginLeft: "120px", padding: "20px" }}
      >
        <br />
        <h2>Calendar</h2>
        <hr />
        <div className="alert alert-info" role="alert">
          <h3>Calendar Integration Coming Soon!</h3>
          <p className="mb-0">This feature will be available in a future update.</p>
        </div>
      </div>
    </div>
  );
}