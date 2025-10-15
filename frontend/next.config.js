/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  productionBrowserSourceMaps: true,
  trailingSlash: true,
};

module.exports = nextConfig;
