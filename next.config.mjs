/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Set NEXT_IMAGE_UNOPTIMIZED=true only for local previews without internet access
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === "true",
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
