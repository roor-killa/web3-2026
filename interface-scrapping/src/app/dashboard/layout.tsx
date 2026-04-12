
'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { clearAuthStorage, hasValidAccessToken } from "@/lib/karibdocs-api";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hasValidAccessToken()) {
      router.replace("/login");
    }
  }, [router, pathname]);

  function handleDisconnect() {
    clearAuthStorage();
    router.replace("/login");
  }

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

          <Nav className="ms-auto d-flex flex-row gap-3 align-items-center">
            <Nav.Link as={Link} href="/dashboard">Scraping</Nav.Link>
            <Nav.Link as={Link} href="/dashboard/data">Data</Nav.Link>
            <Nav.Link as={Link} href="/dashboard/drive">Drive</Nav.Link>
            <Nav.Link as={Link} href="/dashboard/chatbot">Chatbot</Nav.Link>
            <Button type="button" variant="outline-danger" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <main>
        {children}
      </main>
    </>
  );
}
