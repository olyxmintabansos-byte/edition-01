import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/edition-01",
  images: { unoptimized: true },
};

export default nextConfig;
