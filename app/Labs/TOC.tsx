"use client";

import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
export default function TOC() {
  return (
    <div>
      <div>
        <Nav variant="pills">
          <NavItem>
            <NavLink href="/Labs" as={Link}>Labs</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/Labs/Lab1" as={Link}>Lab 1</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/Labs/Lab2" as={Link}>Lab 2</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/Labs/Lab3" as={Link}>Lab 3</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/Labs/Lab4" as={Link}>Lab 4</NavLink>
          </NavItem>

          <NavItem>
            <NavLink href="/Labs/Lab5" as={Link}>Lab 5</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="https://github.com/Prachitapate">My GitHub</NavLink>
          </NavItem>
        </Nav>
      </div>
    </div>
  );
}
