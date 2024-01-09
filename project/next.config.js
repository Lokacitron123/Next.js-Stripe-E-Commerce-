/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "cdn.intersport.se" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
};

module.exports = nextConfig;
