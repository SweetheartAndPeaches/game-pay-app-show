/** @type {import('next').NextConfig} */
const nextConfig = {
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed
  /* config options here */
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
  // Disable Turbopack for CSS to fix PostCSS issues
  experimental: {
    turbo: {
      resolveAlias: {
        // Disable CSS turbopack
      },
    },
  },
};

module.exports = nextConfig;
