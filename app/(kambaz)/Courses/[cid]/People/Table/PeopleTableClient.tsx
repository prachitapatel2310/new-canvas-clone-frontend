"use client";

import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PeopleTableClient() {
  const { cid } = useParams() as { cid?: string };

  // load DB data on the client so server/bundler won't import Database at build time
  const [users, setUsers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    import("../../../../../../../kambaz-node-server-app/Kambaz/Database")
      .then((mod) => {
        if (!mounted) return;
        const db: any = mod || {};
        setUsers(db.users ?? []);
        setEnrollments(db.enrollments ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setUsers([]);
        setEnrollments([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!cid) return <div>No course id provided.</div>;
  if (loading) return <div>Loading people...</div>;

  return (
    <div id="wd-people-table">
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
          {users
            .filter((usr: any) =>
              enrollments.some((en: any) => en.user === usr._id && en.course === cid)
            )
            .map((user: any) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
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
