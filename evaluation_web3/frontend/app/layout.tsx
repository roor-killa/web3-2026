import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CertiChain — Certificats",
  description: "Publier et consulter des certificats numériques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
