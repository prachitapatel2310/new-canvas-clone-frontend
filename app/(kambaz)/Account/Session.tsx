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
"use client";
import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";

export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      console.log("Session: Fetching profile...");
      const currentUser = await client.profile();
      console.log("Session: Profile fetched successfully:", currentUser);
      dispatch(setCurrentUser(currentUser));
    } catch (err: any) {
      console.error("Session: Profile fetch failed (user not logged in):", err.message);
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