/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/welcome',
        destination: '/',
        permanent: true,
      },
      {
        source: '/newsletter',
        destination: '/newsletter/sample',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
