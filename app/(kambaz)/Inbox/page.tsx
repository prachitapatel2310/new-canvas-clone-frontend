// import Link from "next/link";
// import KambazNavigation from "../Navigation";
// export default function Inbox() {
//  return (
//    <div id="wd-inbox">
//     <div>
//             <table>
//               <tbody>
//                 <tr>
//                   <td valign="top" width="180">
//                     <KambazNavigation />
//                   </td>
//                   <td valign="top" width="100%">
//                     <h1 id="wd-inbox-title">Inbox</h1> <hr />
    
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//     </div>
// );}

import { ReactNode } from "react";
import KambazNavigation from "../Navigation";
import "../styles.css";

export default function Calendar({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-kambaz-inbox">
      <div className="d-flex">
        <div className="d-none d-md-block">
        </div>
        <div className="wd-main-content-offset">
          <br />
          <h2>Inbox</h2>
        </div>
        <hr />
      </div>
      <hr />  
    </div>
  );
}
