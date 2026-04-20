import { resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: resolve('.'),
  },
};

export default nextConfig;
