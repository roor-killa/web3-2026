import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rci.fm",
      },
      {
        protocol: "https",
        hostname: "www.rci.fm",
      },
    ],
  },
};

export default nextConfig;
