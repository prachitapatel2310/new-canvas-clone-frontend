"use client";
import { ListGroup, ListGroupItem, Navbar, Nav, Offcanvas, Container } from "react-bootstrap";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function KambazNavigation() {
  const pathname = usePathname();
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
        id="wd-kambaz-navigation"
        style={{ width: 120 }}
        className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      >
        <ListGroupItem
          id="wd-neu-link"
          target="_blank"
          href="https://www.northeastern.edu/"
          action
          className="bg-black border-0 text-center"
        >
          <img src="/images/NEU.png" width="75px" />
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
            key={link.path}
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
      <Navbar bg="black" variant="dark" className="d-md-none">
        <Container fluid>
          <Navbar.Toggle aria-controls="kambaz-offcanvas" className="ms-2" />
          <Navbar.Brand as={Link} href="/" className="text-white ms-2">
            <img src="/images/NEU.png" width="40px" className="me-2" />
            Kambaz
          </Navbar.Brand>

          <Offcanvas id="kambaz-offcanvas" placement="start" className="bg-black text-white">
            <Offcanvas.Header closeButton closeVariant="white" className="bg-black text-white">
              <Offcanvas.Title className="text-white">Kambaz</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="bg-black">
              <Nav className="flex-column">
                <Nav.Item className="mb-2">
                  <Nav.Link as={Link} href="/Account" className={`text-white ${pathname?.includes("Account") ? "text-danger" : ""}`}>
                    <FaRegCircleUser className={`me-2 ${pathname?.includes("Account") ? "text-danger" : "text-white"}`} />
                    Account
                  </Nav.Link>
                </Nav.Item>

                {links.map((link) => (
                  <Nav.Item key={link.path} className="mb-2">
                    <Nav.Link
                      as={Link}
                      href={link.path}
                      className={`text-white ${pathname?.includes(link.label) ? "text-danger" : ""}`}
                    >
                      {link.icon({ className: "me-2" })}
                      {link.label}
                    </Nav.Link>
                  </Nav.Item>
                ))}

                <Nav.Item className="mt-3">
                  <Nav.Link href="https://www.northeastern.edu/" target="_blank" className="text-white">
                    NEU Website
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}
