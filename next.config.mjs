/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "links.papareact.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "linkedincloneyt.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "linkedin-uploads1.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
