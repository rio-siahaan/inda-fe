/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  experimental: {
    allowedDevOrigins: ["http://localhost:3000"],
    appDir: true,
  },
};

module.exports = nextConfig;
