import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
