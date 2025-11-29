"use client"
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
// Removed useEffect, useState, and other imports used for local data fetching
import PeopleDetails from "../Details"; // Import the new details component

// Interface definition for props (reused from previous step)
export default function PeopleTableClient({ users = [], fetchUsers }: { users?: any[]; fetchUsers: () => void; }) {
    
    // NEW STATE: Manage the visibility and content of the details sidebar
    const [showDetails, setShowDetails] = useState(false);
    const [showUserId, setShowUserId] = useState<string | null>(null);

    // Filtered users array must be the source of truth for the table rendering
    // Since this component is reused by the Courses/People route, it renders 
    // filtered data if passed, or all data if passed from the /Account/Users page.

    return (
        <div id="wd-people-table">
            
            {/* 1. Conditional Render of PeopleDetails Sidebar */}
            {showDetails && (
                <PeopleDetails
                    uid={showUserId} // Pass the ID of the user to fetch
                    onClose={() => {
                        setShowDetails(false); // Hide the sidebar
                        fetchUsers(); // Refresh the list in case of external changes
                    }}
                />
            )}

            <Table striped>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Login ID</th>
                        <th>Section</th>
                        <th>Role</th>
                        <th>Last Activity</th>
                        <th>Total Activity</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: any) => (
                        <tr key={user._id}>
                            <td className="wd-full-name text-nowrap">
                                <span 
                                    className="text-decoration-none cursor-pointer" // Make it look clickable
                                    onClick={() => {
                                        setShowDetails(true); // Show the sidebar
                                        setShowUserId(user._id); // Set the user ID to fetch details
                                    }} 
                                    style={{ cursor: 'pointer' }}
                                >
                                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                                    <span className="wd-first-name">{user.firstName}</span>{" "}
                                    <span className="wd-last-name">{user.lastName}</span>
                                </span>
                            </td>
                            <td className="wd-login-id">{user.loginId}</td>
                            <td className="wd-section">{user.section}</td>
                            <td className="wd-role">{user.role}</td>
                            <td className="wd-last-activity">{user.lastActivity}</td>
                            <td className="wd-total-activity">{user.totalActivity}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}