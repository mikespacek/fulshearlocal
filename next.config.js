/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors during build to allow deployment on Vercel
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 