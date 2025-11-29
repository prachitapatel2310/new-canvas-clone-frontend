// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useSelector } from "react-redux";
// import type { RootState } from "../store";

// interface AccountNavigationProps {
//   activePage?: string;
// }

// export default function AccountNavigation({ activePage }: AccountNavigationProps) {
//   const { currentUser } = useSelector((state: RootState) => state.accountReducer);
//   const pathname = usePathname();

//   const links = currentUser ? ["Profile"] : ["Signin", "Signup"];

//   const getItemClass = (page: string) => {
//     const name = page.toLowerCase();
//     const isActive = activePage ? activePage === page : pathname?.endsWith(name);
//     return `list-group-item border-0 ${isActive ? "wd-active text-black border-start border-4 border-black" : "text-danger"}`;
//   };

//   return (
//     <div className="wd list-group fs-5 rounded-0">
//       {links.includes("Signin") && (
//         <Link href="/Account/Signin" id="wd-account-signin-link" className={getItemClass("Signin")}>
//           <h5>Signin</h5>
//         </Link>
//       )}
//       {links.includes("Signup") && (
//         <Link href="/Account/Signup" id="wd-account-signup-link" className={getItemClass("Signup")}>
//           <h5>Signup</h5>
//         </Link>
//       )}
//       {links.includes("Profile") && (
//         <Link href="/Account/Profile" id="wd-account-profile-link" className={getItemClass("Profile")}>
//           <h5>Profile</h5>
//         </Link>
//       )}
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Nav, NavLink } from "react-bootstrap"; // Import Nav and NavLink

// Removed the interface and activePage prop since the Nav component handles active state internally

export default function AccountNavigation() {
  // Get current user from Redux store
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const pathname = usePathname();

  // Determine which links to show based on login status
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];

  // Function to check if a link is active based on pathname ending
  const isActive = (pageName: string) => pathname?.endsWith(pageName);

  return (
    // Use React-Bootstrap Nav component with 'pills' variant
    <Nav variant="pills" className="flex-column wd-account-navigation">
      
      {/* Signin Link (Shown if not logged in) */}
      {links.includes("Signin") && (
        <NavLink 
          as={Link}
          href="/Account/Signin" 
          id="wd-account-signin-link"
          active={isActive("Signin")}
          className="text-danger" // Keep original text color
        >
          <h5>Signin</h5>
        </NavLink>
      )}

      {/* Signup Link (Shown if not logged in) */}
      {links.includes("Signup") && (
        <NavLink 
          as={Link}
          href="/Account/Signup" 
          id="wd-account-signup-link"
          active={isActive("Signup")}
          className="text-danger" // Keep original text color
        >
          <h5>Signup</h5>
        </NavLink>
      )}

      {/* Profile Link (Shown if logged in) */}
      {links.includes("Profile") && (
        <NavLink 
          as={Link}
          href="/Account/Profile" 
          id="wd-account-profile-link"
          active={isActive("Profile")}
          className="text-danger" // Keep original text color
        >
          <h5>Profile</h5>
        </NavLink>
      )}

      {/* NEW ADMIN-ONLY LINK: Users */}
      {currentUser && currentUser.role === "ADMIN" && (
        <NavLink 
          as={Link} 
          href="/Account/Users" 
          active={isActive("Users")}
          className="text-danger" // Maintain consistent styling for unselected state
        >
          <h5>Users</h5>
        </NavLink>
      )}
    </Nav>
  );
}