/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cappuccino.app',
      },
      {
        protocol: 'https',
        hostname: '**.dzign-e.app',
      },
    ],
  },
  transpilePackages: ['@cappuccino/web-sdk'],
};

module.exports = nextConfig;
