import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3005";
const apiUrl = new URL(apiBaseUrl);

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  distDir: "build",
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", ""),
        hostname: apiUrl.hostname,
        port: apiUrl.port || undefined,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
