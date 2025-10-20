/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allow builds to succeed even when ESLint reports warnings.
    // Remove or set to false after you address the reported warnings.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
