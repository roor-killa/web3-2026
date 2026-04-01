import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CertiChain — Certificats Numériques",
  description: "Application de gestion de certificats numériques avec preuve blockchain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
