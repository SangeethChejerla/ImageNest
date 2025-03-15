// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ptckbjlciyqhxhmhtgwe.supabase.co',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}