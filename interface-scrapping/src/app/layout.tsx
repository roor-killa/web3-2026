
'use client'

import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Nav, Navbar } from "react-bootstrap";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();

  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
