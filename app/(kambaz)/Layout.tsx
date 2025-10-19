// import { ReactNode } from "react";
// import KambazNavigation from "./Navigation";
// import "./styles.css";
// import "./KambazNavigation.css";  // Import navigation CSS
// import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

// export const metadata: Metadata = {
//   title: "Kambaz",
//   description: "Learning Management System",
// };

// // Add this for mobile responsiveness
// export const viewport = {
//   width: 'device-width',
//   initialScale: 1,
// };

// export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
//   return (
//     <div id="wd-kambaz">
//       <div className="d-flex">
//         <KambazNavigation />
//         <div className="wd-main-content-offset">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }


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