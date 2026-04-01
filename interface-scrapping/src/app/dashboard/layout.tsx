
'use client'

import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <Navbar bg="light" expand="md" className="border-bottom py-3">
        <Container>
          <Navbar.Brand as={Link} href="/dashboard" className="d-flex align-items-center gap-2 mb-0">
            <span
              aria-hidden="true"
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#9ca3af",
                display: "inline-block",
              }}
            />
            <span>logo</span>
          </Navbar.Brand>

          <Nav className="ms-auto d-flex flex-row gap-3">
            <Nav.Link as={Link} href="/dashboard">Scrap</Nav.Link>
            <Nav.Link as={Link} href="/dashboard/data">Data</Nav.Link>
            <Nav.Link as={Link} href="/dashboard/chatbot">Chatbot</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <main>
        {children}
      </main>
    </>
  );
}
