"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FormControl } from "react-bootstrap";
// NOTE: Assuming the path to PeopleTableClient is correct relative to this file
import PeopleTableClient from "../../Courses/[cid]/People/Table/PeopleTableClient";
import * as client from "../client";
import { FaPlus } from "react-icons/fa6"; // Using FaPlus from fa6 for the button icon

// Define the available roles for type safety and easy management
const ROLES = {
  STUDENT: "Student",
  TA: "Assistant",
  FACULTY: "Faculty",
  ADMIN: "Administrator",
  USER: "General User",
} as const;

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const { uid } = useParams();

  const fetchUsers = async () => {
    try {
      // Default fetch: get all users
      const fetchedUsers = await client.findAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  // Function to create a new user (retained)
  const createUser = async () => {
    // Determine a default role for the new user, e.g., 'STUDENT'
    const defaultRole = "STUDENT";
    
    // 1. Send the new user payload to the server
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: defaultRole, // Use a default role
    });

    // 2. Optimistically update the local list
    setUsers([...users, user]);
    
    // 3. Call fetchUsers to ensure the table reflects the actual database state
    fetchUsers(); 
  };

  // Logic to filter by Role (retained)
  const filterUsersByRole = async (selectedRole: string) => {
    setRole(selectedRole);
    setName(""); // Reset name filter when role changes
    if (selectedRole) {
      try {
        const filteredUsers = await client.findUsersByRole(selectedRole);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error filtering by role:", error);
      }
    } else {
      // If "All Roles" is selected, clear filters and fetch all users
      fetchUsers();
    }
  };

  // Logic to filter by Partial Name (retained)
  const filterUsersByName = async (partialName: string) => {
    setName(partialName);
    setRole(""); // Reset role filter when name changes
    if (partialName.trim()) {
      try {
        const filteredUsers = await client.findUsersByPartialName(partialName.trim());
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error filtering by name:", error);
      }
    } else {
      // If search box is cleared, clear filters and fetch all users
      fetchUsers();
    }
  };

  // Fetch all users on initial load (retained)
  useEffect(() => {
    if (!role && !name) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return (
    <div>
      {/* Add Users button (retained) */}
      <button 
        onClick={createUser} 
        className="float-end btn btn-danger wd-add-people"
      >
        <FaPlus className="me-2" />
        Users
      </button>

      <h3>Users Management 👥</h3>
      <hr />
      <div className="d-flex mb-3 align-items-center">
        
        {/* Filter by Name Input (retained) */}
        <FormControl 
          onChange={(e) => filterUsersByName(e.target.value)} 
          placeholder="Search people by name"
          className="float-start w-25 me-2 wd-filter-by-name" 
          value={name}
        />
        
        {/* Filter by Role Dropdown - UPDATED HERE */}
        <select 
          value={role} 
          onChange={(e) => filterUsersByRole(e.target.value)}
          className="form-select float-start w-25 wd-select-role" 
        >
          <option value="">All Roles</option>
          {/* Dynamically create options from the ROLES object */}
          {Object.entries(ROLES).map(([roleKey, roleLabel]) => (
            <option key={roleKey} value={roleKey}>
              {roleLabel}
            </option>
          ))}
        </select>
      </div>

      <PeopleTableClient users={users} fetchUsers={fetchUsers} />
    </div>
  );
}