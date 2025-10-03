/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Necessário para export estático
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
    serverComponentsExternalPackages: ['sharp'],
  },
  // Configuração para export estático
  output: 'export',
  distDir: './out',
  trailingSlash: true, // (opcional, mas pode remover)
}

module.exports = nextConfig