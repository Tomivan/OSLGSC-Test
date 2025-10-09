/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com', // If you use Google auth profile images
      'storage.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/oslgsc.firebasestorage.app/o/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
