import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    domains: ["lh3.googleusercontent.com"]
  },
  experimental:{
    allowedDevOrigins: ['http://localhost:3000']
  }
  /* config options here */
};

export default nextConfig;
