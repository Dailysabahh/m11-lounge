import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  agentRules: false,
  async redirects() {
    return [
      { source: "/landing", destination: "/coming-soon", permanent: true },
    ];
  },
};

export default nextConfig;
