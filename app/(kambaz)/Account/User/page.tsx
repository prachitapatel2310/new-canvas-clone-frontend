"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FormControl } from "react-bootstrap";
import PeopleTableClient from "../../Courses/[cid]/People/Table/PeopleTableClient";
import * as client from "../client";
import { FaPlus } from "react-icons/fa6"; // Using FaPlus from fa6 for the button icon

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

  // NEW: Function to create a new user (as per instructions)
  const createUser = async () => {
    // 1. Send the new user payload to the server
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    });

    // 2. Optimistically update the local list
    setUsers([...users, user]);
    
    // 3. Call fetchUsers to ensure the table reflects the actual database state
    // (especially important if the server sets additional default fields)
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
    // Only fetch if a filter isn't already active (or for initial population)
    if (!role && !name) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  return (
    <div>
      {/* NEW: Add Users button */}
      <button 
        onClick={createUser} 
        className="float-end btn btn-danger wd-add-people"
      >
        <FaPlus className="me-2" />
        Users
      </button>

      <h3>Users</h3>
      <div className="d-flex mb-3 align-items-center">
        
        {/* Filter by Name Input */}
        <FormControl 
          onChange={(e) => filterUsersByName(e.target.value)} 
          placeholder="Search people by name"
          className="float-start w-25 me-2 wd-filter-by-name" 
          value={name}
        />
        
        {/* Filter by Role Dropdown */}
        <select 
          value={role} 
          onChange={(e) => filterUsersByRole(e.target.value)}
          className="form-select float-start w-25 wd-select-role" 
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
          <option value="USER">General Users</option>
        </select>
      </div>

      <PeopleTableClient users={users} fetchUsers={fetchUsers} />
    </div>
  );
}