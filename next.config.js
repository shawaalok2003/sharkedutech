/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
