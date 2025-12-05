// import * as client from "./client";
// import { useEffect, useState } from "react";
// import { setCurrentUser } from "./reducer";
// import { useDispatch } from "react-redux";
// export default function Session({ children }: { children: any }) {
//   const [pending, setPending] = useState(true);
//   const dispatch = useDispatch();
//   const fetchProfile = async () => {
//     try {
//       const currentUser = await client.profile();
//       dispatch(setCurrentUser(currentUser));
//     } catch (err: any) {
//       console.error(err);
//     }
//     setPending(false);
//   };
//   useEffect(() => {
//     fetchProfile();
//   }, []);
//   if (!pending) {
//     return children;
//   }
// }
// "use client";
// import * as client from "./client";
// import { useEffect, useState } from "react";
// import { setCurrentUser } from "./reducer";
// import { useDispatch } from "react-redux";

// export default function Session({ children }: { children: any }) {
//   const [pending, setPending] = useState(true);
//   const dispatch = useDispatch();

//   const fetchProfile = async () => {
//     try {
//       console.log("Session: Fetching profile...");
//       const currentUser = await client.profile();
//       console.log("Session: Profile fetched successfully:", currentUser);
//       dispatch(setCurrentUser(currentUser));
//     } catch (err: any) {
//       console.error("Session: Profile fetch failed (user not logged in):", err.message);
//       dispatch(setCurrentUser(null));
//     } finally {
//       setPending(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//     // Only run once on mount
//   }, []);

//   if (pending) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   return children;
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(kambaz)/Account/Session.tsx
"use client";
import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";

// --- START: DEVELOPMENT BYPASS CONFIGURATION ---
// Set this flag to true to skip API profile fetch and inject a dummy user.
// Set to false for normal, authenticated behavior.
const DEV_AUTH_BYPASS = true; // <--- SET THIS TO 'true' FOR STATIC VIEWING

const DUMMY_USER = {
  _id: "DUMMY_STUDENT_ID_123",
  username: "dev_student",
  firstName: "Dev",
  lastName: "Student",
  // Set role to STUDENT to test student-specific pages like QuizTake
  role: "STUDENT", 
  email: "dev.student@neu.edu",
};
// --- END: DEVELOPMENT BYPASS CONFIGURATION ---

export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    // 1. Check for DEV_AUTH_BYPASS flag
    if (DEV_AUTH_BYPASS) {
      console.log("Session: DEVELOPMENT BYPASS ACTIVE. Setting dummy user.");
      dispatch(setCurrentUser(DUMMY_USER));
      setPending(false);
      return;
    }
    
    // 2. Normal production logic (fetches real user)
    try {
      console.log("Session: Fetching profile...");
      const currentUser = await client.profile();
      console.log("Session: Profile fetched successfully:", currentUser);
      dispatch(setCurrentUser(currentUser));
    } catch (err: any) {
      console.error("Session: Profile fetch failed (user not logged in):", err.message);
      // In normal mode, set to null to trigger signin redirection
      dispatch(setCurrentUser(null));
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // Only run once on mount
  }, []);

  if (pending) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  return children;
}