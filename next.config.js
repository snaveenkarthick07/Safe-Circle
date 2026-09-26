/** @type {import('next').NextConfig} */
const isMobileBuild = process.env.MOBILE_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  ...(isMobileBuild
    ? {
        output: 'export',
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {
        async redirects() {
          return [
            {
              source: '/map.',
              destination: '/map',
              permanent: false,
            },
            {
              source: '/dashboard.',
              destination: '/dashboard',
              permanent: false,
            },
            {
              source: '/journey.',
              destination: '/journey',
              permanent: false,
            },
            {
              source: '/reports.',
              destination: '/reports',
              permanent: false,
            },
            {
              source: '/vault.',
              destination: '/vault',
              permanent: false,
            },
            {
              source: '/standalone.',
              destination: '/standalone',
              permanent: false,
            },
          ];
        },
      }),
};

module.exports = nextConfig;

