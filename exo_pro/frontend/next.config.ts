// Frontend - commentaires simples en français.
// Configuration Next.js : options de build et configuration d'images.
// Ici on autorise des images distantes venant de `localhost:8000`.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
    ],
  },
};

export default nextConfig;
