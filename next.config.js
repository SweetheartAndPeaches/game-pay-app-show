/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
    ],
  },
  // Disable Turbopack
  experimental: {
    turbo: {},
  },
  // Force webpack for CSS
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
