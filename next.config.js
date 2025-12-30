/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Não precisa de remotePatterns porque usamos proxy local /api/media/
    // O Next Image vai otimizar as imagens que passam pelo nosso proxy
    unoptimized: false,
  },
};

module.exports = nextConfig;
