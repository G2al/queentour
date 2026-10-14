import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/storage/**" },
  { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
  { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
];

if (process.env.API_URL) {
  const backendUrl = new URL(process.env.API_URL);
  remotePatterns.push({
    protocol: backendUrl.protocol === "https:" ? "https" : "http",
    hostname: backendUrl.hostname,
    port: backendUrl.port,
    pathname: "/storage/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
