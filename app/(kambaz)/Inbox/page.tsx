import { ReactNode } from "react";
import "../styles.css";

// DO NOT import KambazNavigation here

export default function Inbox({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-kambaz-inbox">
      {/* The KambazNavigation is already rendered by the layout.tsx */}
      <div className="wd-main-content-offset" style={{ marginLeft: 0 }}>
        <br />
        <h2>Inbox</h2>
        <hr />
        <div className="alert alert-info" role="alert">
          <h3>Inbox Integration Coming Soon!</h3>
          <p className="mb-0">This feature will be available in a future update.</p>
        </div>
      </div>
    </div>
  );
}