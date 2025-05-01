// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['m.media-amazon.com'],
    },
    async rewrites() {
      return [
        {
          source: '/admin/login',
          destination: '/app/admin/login', // Adjust as per your folder structure
        },
      ];
    },
  };
  
  export default nextConfig;
  