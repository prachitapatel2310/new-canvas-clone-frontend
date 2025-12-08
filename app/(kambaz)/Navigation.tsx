"use client";

import React, { useState } from "react";
import { ListGroup, ListGroupItem, Navbar, Nav, Offcanvas, Container } from "react-bootstrap";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function KambazNavigation() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const links = [
    { label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard },
    { label: "Courses", path: "/Dashboard", icon: LiaBookSolid }, // intentionally routes to Dashboard
    { label: "Calendar", path: "/Calendar", icon: IoCalendarOutline },
    { label: "Inbox", path: "/Inbox", icon: FaInbox },
    { label: "Labs", path: "/Labs", icon: LiaCogSolid },
  ];

  return (
    <>
      {/* Desktop sidebar (unchanged styling) */}
      <ListGroup
        id="wd-sidebar"
        style={{ width: 110 }}
        className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      >
        <ListGroupItem
          id="wd-neu-link"
          target="_blank"
          href="https://www.northeastern.edu/"
          action
          className="bg-black border-0 text-center"
        >
          <img src="data:image/jpeg;base64,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" width="75px" />
        </ListGroupItem>

        <ListGroupItem
          as={Link}
          href="/Account"
          className={`text-center border-0 bg-black ${
            pathname?.includes("Account") ? "bg-white text-danger" : "bg-black text-white"
          }`}
        >
          <FaRegCircleUser
            className={`fs-1 ${pathname?.includes("Account") ? "text-danger" : "text-white"}`}
          />
          <br />
          Account
        </ListGroupItem>

        {links.map((link) => (
          <ListGroupItem
            key={`${link.path}-${link.label}`}
            as={Link}
            href={link.path}
            className={`bg-black text-center border-0 ${
              pathname?.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"
            }`}
          >
            {link.icon({ className: "fs-1 text-danger" })}
            <br />
            {link.label}
          </ListGroupItem>
        ))}
      </ListGroup>

      {/* Mobile hamburger + offcanvas (reuses same links) */}
      <Navbar bg="white" variant="light" className="d-md-none">
        <Container fluid>
          {/* custom hamburger button matches your CSS (#wd-hamburger-btn and .wd-hamburger-icon) */}
          <button
            id="wd-hamburger-btn"
            type="button"
            className="ms-2"
            aria-controls="kambaz-offcanvas"
            aria-expanded={show}
            onClick={() => setShow(true)}
          >
            <span className="wd-hamburger-icon" />
            <span className="wd-hamburger-icon" />
            <span className="wd-hamburger-icon" />
          </button>

          {/* mobile brand: 3-line logo (no "Kambaz" text) */}
          <Navbar.Brand as={Link} href="/" className="text-dark ms-2">
            <div className="wd-logo-lines" aria-hidden="true">
              <span className="wd-logo-line" />
              <span className="wd-logo-line" />
              <span className="wd-logo-line" />
            </div>
          </Navbar.Brand>

          <Offcanvas
            id="kambaz-offcanvas"
            placement="start"
            className="wd-mobile-menu"
            show={show}
            onHide={() => setShow(false)}
          >
            {/* header with close button only (no Kambaz text) */}
            <Offcanvas.Header closeButton closeVariant="dark" className="wd-mobile-header" />

            <Offcanvas.Body className="wd-mobile-body">
              {/* Account first */}
              <div className="text-center mb-3">
                <Link href="/Account" onClick={() => setShow(false)} className="wd-mobile-nav-link d-inline-flex flex-column align-items-center">
                  <FaRegCircleUser className="wd-mobile-nav-icon text-danger" />
                  <span className="wd-mobile-nav-text">Account</span>
                </Link>
              </div>

              {/* Links (centered, large, red) */}
              <ul className="wd-mobile-nav-list list-unstyled text-center">
                {links.map((link) => (
                  <li key={`${link.path}-${link.label}`} className="mb-3">
                    <Link
                      href={link.path}
                      onClick={() => setShow(false)}
                      className={`wd-mobile-nav-link d-inline-flex flex-column align-items-center ${pathname?.includes(link.label) ? "active" : ""}`}
                    >
                      {link.icon({ className: "wd-mobile-nav-icon text-danger" })}
                      <span className="wd-mobile-nav-text">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="text-center mt-4">
                <a href="https://www.northeastern.edu/" target="_blank" rel="noreferrer" className="wd-mobile-nav-link d-inline-flex flex-column align-items-center">
                  <span className="wd-mobile-nav-icon text-danger">🔗</span>
                  <span className="wd-mobile-nav-text">NEU Website</span>
                </a>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}
