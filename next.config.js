/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'mojopahit-furniture.s3.ap-southeast-1.amazonaws.com',
              port: '',
              pathname: '/assets/**',
            },
            {
              protocol: 'https',
              hostname: 'robohash.org',
              port: '',
              pathname: '/**',
            },
          ],
    },
}

module.exports = nextConfig
