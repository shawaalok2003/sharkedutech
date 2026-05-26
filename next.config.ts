import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/auth/register',
        destination: '/auth/signup',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
