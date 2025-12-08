// export const dynamic = "force-dynamic";
// import PeopleTableClient from "./PeopleTableClient";

// export default function Page() {
//   return <PeopleTableClient />;
// }

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
// Import the component that requires the props
import PeopleTableClient from "./PeopleTableClient";
// Import client functions
import * as client from "../../../client"; 

// Rename function to Page (as required by Next.js conventions)
export default function PeopleTablePage() { 
	const { cid } = useParams() as { cid?: string };
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch only enrolled users for this course
  const fetchEnrolledUsers = async () => {
    if (!cid) return;
    setLoading(true);
    try {
      // Calls: /api/courses/:cid/users
      const fetchedUsers = await client.findUsersForCourse(cid);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching enrolled users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledUsers();
  }, [cid]); // Fetch on mount or when course ID changes

	return (
		<div id="wd-people">
			<h1>People in Course {cid}</h1>
			<hr />
			<div className="d-flex">
				<div className="flex-fill p-3">
					<div id="wd-people-page">
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              // FIX: Pass the required props (users and fetchUsers)
              <PeopleTableClient users={users} fetchUsers={fetchEnrolledUsers} />
            )}
					</div>
				</div>
			</div>
		</div>
	);
}