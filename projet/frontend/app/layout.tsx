import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Frontend Next.js - Web3 2026",
    description: "Application Next.js pour le projet Web3",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    );
}
