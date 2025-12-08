// "use client";

// import { ReactNode } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import KambazNavigation from "./Navigation";
// import "./KambazNavigation.css";
// import "./styles.css";
// import Session from "./Account/Session";

// export default function KambazLayout({ 
//   children 
// }: Readonly<{ children: ReactNode }>) {
//   return (
//     <>
//     <Session>
//       <div id="wd-kambaz">
//         <div className="wd-main-content-offset">
//           {children}
//         </div>
//       </div>
//       </Session>
//     </>
//   );
// }

// app/(kambaz)/layout.tsx
"use client";

import { ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import KambazNavigation from "./Navigation";
import "./KambazNavigation.css";
import "./styles.css";
import Session from "./Account/Session";

export default function KambazLayout({ 
  children 
}: Readonly<{ children: ReactNode }>) {
  return (
    <Session>
      <div id="wd-kambaz" style={{ position: 'relative', minHeight: '100vh' }}>
        {/* ✅ FIXED: Always render sidebar with highest z-index */}
        <div 
          id="wd-sidebar-wrapper"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '96px',
            height: '100vh',
            zIndex: 99999,
            pointerEvents: 'auto',
            backgroundColor: '#000'
          }}
        >
          <KambazNavigation />
        </div>

        {/* Main content area */}
        <div 
          className="wd-main-content-offset" 
          style={{ 
            marginLeft: '96px',
            width: 'calc(100% - 96px)',
            minHeight: '100vh',
            position: 'relative',
            zIndex: 1
          }}
        >
          {children}
        </div>
      </div>
    </Session>
  );
}
