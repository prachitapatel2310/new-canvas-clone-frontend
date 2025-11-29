"use client";
import { useEffect, useState } from "react";
// Import FaPencil and FaCheck as required by instructions
import { FaUserCircle, FaCheck } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6"; 
import { IoCloseSharp } from "react-icons/io5";
import * as client from "../../../Account/client";
import { FormControl } from "react-bootstrap"; // Import FormControl for inputs

// Defines the shape of the user data expected
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string; // Added email for editing
  loginId: string;
  section: string;
  totalActivity: string;
  // Add other properties as needed
}

export default function PeopleDetails({ uid, onClose }: { uid: string | null; onClose: () => void; }) {
  // Initialize user state with an empty object of type User
  const [user, setUser] = useState<User | any>({});
  
  // NEW STATE VARIABLES FOR EDITING
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState(false);
  
  const fetchUser = async (userId: string) => {
    try {
        const fetchedUser = await client.findUserById(userId);
        setUser(fetchedUser);
        // Initialize editing fields when user loads
        setName(`${fetchedUser.firstName ?? ""} ${fetchedUser.lastName ?? ""}`.trim());
        setEmail(fetchedUser.email ?? "");
        setRole(fetchedUser.role ?? "");
    } catch (error) {
        console.error("Error fetching user details:", error);
        setUser({}); 
        // Clear editing fields on error
        setName("");
        setEmail("");
        setRole("");
    }
  };
  
  // NEW: Function to save user updates
  const saveUser = async () => {
    // 1. Split the name state variable into firstName and lastName
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    // Join the rest back as lastName, or set to empty string if only one part
    const lastName = nameParts.slice(1).join(" ") || "";
    
    // 2. Create the updated user object
    const updatedUser = { 
        ...user, 
        firstName, 
        lastName,
        email: email.trim(), // Save updated email
        role: role,          // Save updated role
    };
    
    try {
        // 3. Send update to server
        await client.updateUser(updatedUser);
        
        // 4. Update local copy of the user
        setUser(updatedUser);
        
        // 5. Turn off editing
        setEditing(false);
        
        // 6. Close the dialog (and trigger parent list refresh)
        onClose();
        
    } catch (error) {
        console.error("Error saving user:", error);
        alert("Failed to save user. Please check server logs.");
    }
  };

  // Function to delete the user (retained from previous step)
  const deleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await client.deleteUser(userId);
        onClose(); // Hide the sidebar and trigger parent to refresh user list
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  // Use useEffect to fetch user data whenever uid changes
  useEffect(() => {
    if (uid) {
      fetchUser(uid);
    } else {
      setUser({}); // Clear user if uid is null
      setEditing(false); // Ensure editing is off when no user is selected
    }
    // Depend on uid so clicking a different user updates the view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]); 
  
  // Guard clause: If no UID is provided, do not render
  if (!uid) return null;
  
  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25 border-start">
      {/* Close button */}
      <button 
        onClick={onClose} 
        className="btn position-absolute end-0 top-0 wd-close-details"
        style={{ zIndex: 100 }} 
        disabled={editing} // Disable close button while editing
      >
        <IoCloseSharp className="fs-1" /> 
      </button>

      <div className="text-center mt-4"> 
        <FaUserCircle className="text-secondary me-2 fs-1" /> 
      </div>
      <hr />
      
      {/* Display/Edit User Name */}
      <div className="text-danger fs-4 mb-3">
        {/* Pencil Icon (Edit mode OFF) */}
        {!editing && (
          <FaPencil 
            onClick={() => {
              setEditing(true);
              setName(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()); // Re-initialize in case of cancellation
            }}
            className="float-end fs-5 mt-2 wd-edit cursor-pointer" 
            style={{ cursor: "pointer" }}
            title="Edit Name"
          /> 
        )}
        {/* Check Icon (Edit mode ON) */}
        {editing && (
          <FaCheck 
            onClick={saveUser}
            className="float-end fs-5 mt-2 me-2 wd-save cursor-pointer"
            style={{ cursor: "pointer" }}
            title="Save Changes"
          /> 
        )}
        
        {/* Display Name (Edit mode OFF) */}
        {!editing && (
          <div 
            className="wd-name"
            onClick={() => setEditing(true)}
            style={{ cursor: "pointer" }}
          >
            {user.firstName} {user.lastName}
          </div>
        )}
        
        {/* Edit Name Input (Edit mode ON) */}
        {user && editing && (
          <FormControl 
            className="w-100 wd-edit-name" // Use w-100 to fit better
            value={name} // Use value to control the input, not defaultValue
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { 
                saveUser(); 
              }
            }}
          />
        )}
      </div>
      
      {/* --- Other Details (Always visible, but editable fields show inputs) --- */}
      {user._id ? (
        <>
          {/* Roles - Use Dropdown/Select for editing */}
          <b>Roles:</b> 
          {editing ? (
            <select 
              className="form-control mb-2 wd-edit-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="FACULTY">Faculty</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="TA">TA</option>
              <option value="STUDENT">Student</option>
            </select>
          ) : (
            <span className="wd-roles"> {user.role}</span>
          )}
          <br />

          {/* Email - Use Input field for editing */}
          <b>Email:</b>
          {editing ? (
            <FormControl
              type="email"
              className="mb-2 wd-edit-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { saveUser(); }
              }}
            />
          ) : (
            <span className="wd-email"> {user.email || 'N/A'}</span>
          )}
          <br />

          {/* Login ID, Section, Activity (Read-only on this view) */}
          <b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span> <br />
          <b>Section:</b> <span className="wd-section">{user.section}</span> <br />
          <b>Total Activity:</b> <span className="wd-total-activity">{user.totalActivity}</span> <br />
        
          {/* Action Buttons: Cancel and Delete */}
          <div className="mt-4 d-flex justify-content-end">
            {/* Cancel hides details and reverts unsaved changes by setting editing to false */}
            <button 
              onClick={() => {
                if (editing) {
                  setEditing(false); // Just turn off editing if currently editing
                } else {
                  onClose(); // Close the sidebar if not editing
                }
              }}
              className="btn btn-secondary me-2 wd-cancel" 
            > 
              {editing ? "Cancel Edit" : "Cancel"}
            </button>
            <button 
              onClick={() => deleteUser(uid)} 
              className="btn btn-danger wd-delete" 
              disabled={editing} // Disable delete button while editing a user
            > 
              Delete 
            </button>
          </div>
        </>
      ) : (
        <div>Loading user data...</div>
      )}
    </div>
  );
}