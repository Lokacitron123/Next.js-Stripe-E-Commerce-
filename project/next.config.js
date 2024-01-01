/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "cdn.intersport.se" },
    ],
  },
};

module.exports = nextConfig;
