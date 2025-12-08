// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import PeopleTableClient from "./Table/PeopleTableClient";
// import * as client from "../../client"; 

// export default function PeoplePage() { 
// 	const { cid } = useParams() as { cid?: string };
//   const [users, setUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Function to fetch only enrolled users for this course
//   const fetchEnrolledUsers = async () => {
//     if (!cid) return;
//     setLoading(true);
//     try {
//       // Calls: /api/courses/:cid/users (which uses EnrollmentsDao.findUsersForCourse)
//       const fetchedUsers = await client.findUsersForCourse(cid);
//       setUsers(fetchedUsers);
//     } catch (error) {
//       console.error("Error fetching enrolled users:", error);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEnrolledUsers();
//   }, [cid]);

// 	return (
// 		<div id="wd-people">
// 			<h1>People in Course {cid}</h1>
// 			<hr />
// 			<div className="d-flex">
// 				<div className="flex-fill p-3">
// 					<div id="wd-people-page">
//             {loading ? (
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             ) : (
//               // Pass the fetched users and the fetch function for table refresh actions
//               <PeopleTableClient users={users} fetchUsers={fetchEnrolledUsers} />
//             )}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
import { redirect } from "next/navigation";
import { use } from "react"; // Use 'use' to unwrap the Promise

export default function PeoplePage({ params }: { params: Promise<{ cid: string }> }) {
  // Use 'use' to unwrap the promise returned by params
  const { cid } = use(params);
  
  // Redirect to the sub-route where the table content now lives.
  redirect(`/Courses/${cid}/People/Table`);
}