// import { ReactNode } from "react";
// import KambazNavigation from "./../Navigation";
// import Navigation from "./Navigation";
// export default function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
//  return (
//    <div id="wd-kambaz">
//      <table>
//        <tbody>
//          <tr>
//           <td valign="top" width="180">
//             <KambazNavigation/>
//           </td>
//            <td valign="top" width="180">
//              <Navigation />
//            </td>
//            <td valign="top" width="100%">
//              {children}
//            </td>
//          </tr>
//        </tbody>
//      </table>
//   </div>
// );}

'use client';

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import KambazNavigation from "../Navigation";
import AccountNavigation from "./Navigation";

export default function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  
  const getActivePage = () => {
    if (pathname.includes("/Signin")) return "Signin";
    if (pathname.includes("/Signup")) return "Signup";
    if (pathname.includes("/Profile")) return "Profile";
    return "Signin";
  };

  return (
    <div className="d-flex">
      
      <div style={{ marginLeft: '10px' }}>
        <AccountNavigation activePage={getActivePage()} />
      </div>
      
      <div className="flex-fill p-4" style={{ marginLeft: '250px' }}>
        {children}
      </div>
    </div>
  );
}


// 'use client';

// import { ReactNode } from "react";
// import { usePathname } from "next/navigation";
// import AccountNavigation from "./Navigation";
// import KambazNavigation from "../Navigation";

// export default function AccountLayout({ 
//   children 
// }: Readonly<{ children: ReactNode }>) {
//   const pathname = usePathname();
  
//   const getActivePage = () => {
//     if (pathname.includes("/Signin")) return "Signin";
//     if (pathname.includes("/Signup")) return "Signup";
//     if (pathname.includes("/Profile")) return "Profile";
//     return "Signin";
//   };

//   return (
//    <>
//       <KambazNavigation />
    
//       {/* Account Navigation - Don't wrap KambazNav here, it's in parent layout */}
//       <div className="d-none d-md-block">
//         <AccountNavigation activePage={getActivePage()} />
//       </div>
      
//       {/* Use the proper offset class */}
//       <div className="wd-account-content-offset">
//         {children}
//       </div>
      
//     </>
    
//   );
