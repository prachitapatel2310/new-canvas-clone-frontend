// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { ListGroup, ListGroupItem } from "react-bootstrap";
// import { FaRegCalendarAlt, FaUserCircle, FaBookOpen, FaBars, FaTimes } from "react-icons/fa";
// import { FiMail } from "react-icons/fi";
// import { VscBeaker } from "react-icons/vsc";
// import { MdDashboard } from "react-icons/md";

// const links = [
//   { id: "wd-account-link", href: "/Account", label: "Account", icon: <FaUserCircle className="fs-1" /> },
//   { id: "wd-dashboard-link", href: "/Dashboard", label: "Dashboard", icon: <MdDashboard className="fs-1" /> },
//   { id: "wd-courses-link", href: "/Dashboard", label: "Courses", icon: <FaBookOpen className="fs-1" /> },
//   { id: "wd-calendar-link", href: "/Calendar", label: "Calendar", icon: <FaRegCalendarAlt className="fs-1" /> },
//   { id: "wd-inbox-link", href: "/Inbox", label: "Inbox", icon: <FiMail className="fs-1" /> },
//   { id: "wd-labs-link", href: "/Labs", label: "Labs", icon: <VscBeaker className="fs-1" /> },
// ];

// export default function KambazNavigation() {
//   const pathname = usePathname();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     // Check on mount
//     checkMobile();

//     // Add resize listener
//     window.addEventListener("resize", checkMobile);

//     // Cleanup
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Inline styles
//   const hamburgerBtnStyle: React.CSSProperties = {
//     display: isMobile ? "block" : "none",
//     position: "fixed",
//     top: "15px",
//     left: "15px",
//     background: "white",
//     border: "1px solid #ddd",
//     color: "black",
//     zIndex: 1100,
//     padding: "8px 12px",
//     borderRadius: "5px",
//     cursor: "pointer",
//     boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//   };

//   const closeBtnStyle: React.CSSProperties = {
//     display: isMobile ? "block" : "none",
//     position: "absolute",
//     top: "15px",
//     right: "15px",
//     background: "transparent",
//     border: "none",
//     color: "white",
//     zIndex: 1101,
//     cursor: "pointer",
//     fontSize: "24px",
//   };

//   const overlayStyle: React.CSSProperties = {
//     display: isMobile && isOpen ? "block" : "none",
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     zIndex: 999,
//   };

//   const sidebarStyle: React.CSSProperties = {
//     transform: isMobile && !isOpen ? "translateX(-100%)" : "translateX(0)",
//   };

//   return (
//     <>
//       {/* Hamburger Button - mobile only */}
//       <button
//         style={hamburgerBtnStyle}
//         onClick={() => setIsOpen(true)}
//         aria-label="Open navigation menu"
//         onMouseEnter={(e) => {
//           if (isMobile) e.currentTarget.style.background = "#f5f5f5";
//         }}
//         onMouseLeave={(e) => {
//           if (isMobile) e.currentTarget.style.background = "white";
//         }}
//       >
//         <FaBars size={24} />
//       </button>

//       {/* Mobile overlay when sidebar is open */}
//       <div
//         style={overlayStyle}
//         onClick={() => setIsOpen(false)}
//       />

//       {/* Sidebar Navigation */}
//       <ListGroup
//         className="kambaz-sidebar"
//         id="wd-kambaz-navigation"
//         style={sidebarStyle}
//         onClick={() => isMobile && setIsOpen(false)}
//       >
//         {/* Close Button - mobile only */}
//         <button
//           style={closeBtnStyle}
//           onClick={() => setIsOpen(false)}
//           aria-label="Close navigation menu"
//           onMouseEnter={(e) => {
//             if (isMobile) e.currentTarget.style.color = "#ccc";
//           }}
//           onMouseLeave={(e) => {
//             if (isMobile) e.currentTarget.style.color = "white";
//           }}
//         >
//           <FaTimes size={24} />
//         </button>

//         {/* Northeastern Logo */}
//         <ListGroupItem
//           className="bg-black border-0 text-center"
//           as="a"
//           target="_blank"
//           href="https://www.northeastern.edu/"
//           id="wd-neu-link"
//         >
//           <img
//             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaN0w4LxKNf3mbLLL-YgIxBA8CrEXI09BdKA&s"
//             width="75px"
//             alt="Northeastern University"
//           />
//         </ListGroupItem>

//         {/* Dynamic Links */}
//         {links.map(({ id, href, label, icon }) => {
//           const isActive = pathname.startsWith(href);
//           return (
//             <ListGroupItem
//               key={id}
//               id={id}
//               className={`border-0 text-center ${isActive ? "bg-white" : "bg-black"}`}
//             >
//               <Link
//                 href={href}
//                 className={`text-decoration-none ${isActive ? "text-danger" : "text-white"}`}
//               >
//                 {icon}
//                 <br />
//                 {label}
//               </Link>
//             </ListGroupItem>
//           );
//         })}
//       </ListGroup>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./KambazNavigation.css";

interface KambazNavigationProps {
  activePage?: string;
}

export default function KambazNavigation({ activePage }: KambazNavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/Account", id: "wd-account-link", label: "Account", icon: accountIcon },
    { href: "/Dashboard", id: "wd-dashboard-link", label: "Dashboard", icon: dashboardIcon },
    { href: "/Dashboard", id: "wd-courses-link", label: "Courses", icon: coursesIcon },
    { href: "/Calendar", id: "wd-calendar-link", label: "Calendar", icon: calendarIcon },
    { href: "/Inbox", id: "wd-inbox-link", label: "Inbox", icon: inboxIcon },
    { href: "/Labs", id: "wd-labs-link", label: "Labs", icon: labsIcon },
  ];

  const getItemClass = (linkPath: string) => {
    const isActive = activePage
      ? activePage === linkPath.split("/")[1]
      : pathname === linkPath;
    return `wd-nav-link ${isActive ? "active" : ""}`;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav id="wd-sidebar">
        <Link href="https://www.northeastern.edu/" id="wd-neu-logo" target="_blank">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/0/08/Northeastern_seal.svg/200px-Northeastern_seal.svg.png"
            alt="Northeastern University"
          />
          <div id="wd-neu-title">
            Northeastern
            <br />
            University
          </div>
        </Link>

        <ul className="wd-nav-list">
          {links.map((link) => (
            <li key={link.id} className="wd-nav-item">
              <Link href={link.href} id={link.id} className={getItemClass(link.href)}>
                <svg className="wd-nav-icon" viewBox="0 0 24 24">
                  {link.icon}
                </svg>
                <span className="wd-nav-text">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hamburger Menu (Mobile) */}
      <button id="wd-hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
        <div className="wd-hamburger-icon"></div>
        <div className="wd-hamburger-icon"></div>
        <div className="wd-hamburger-icon"></div>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        id="wd-overlay"
        className={isMobileMenuOpen ? "show" : ""}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <nav id="wd-mobile-menu" className={isMobileMenuOpen ? "show" : ""}>
        <div className="wd-mobile-header">
          <span className="wd-mobile-title">Kambaz</span>
          <button id="wd-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            &times;
          </button>
        </div>

        <ul className="wd-mobile-nav-list">
          {links.map((link) => (
            <li key={`mobile-${link.id}`} className="wd-mobile-nav-item">
              <Link
                href={link.href}
                id={`mobile-${link.id}`}
                className="wd-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="wd-mobile-nav-icon" viewBox="0 0 24 24">
                  {link.icon}
                </svg>
                <span className="wd-mobile-nav-text">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

// SVG Icons
const accountIcon = (
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M12 14c-6 0-8 3-8 6h16c0-3-2-6-8-6z" />
  </>
);

const dashboardIcon = <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />;

const coursesIcon = (
  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
);

const calendarIcon = (
  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
);

const inboxIcon = (
  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
);

const labsIcon = (
  <path d="M19.8 18.4L14 10.67V6.5l1.35-1.69c.26-.33.03-.81-.39-.81H9.04c-.42 0-.65.48-.39.81L10 6.5v4.17L4.2 18.4c-.49.66-.02 1.6.8 1.6h14c.82 0 1.29-.94.8-1.6z" />
);
