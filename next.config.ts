import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: __dirname },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }, ...[
      '/', '/perfil', '/confirmar', '/verificar-email', '/recuperar-senha',
      '/redefinir-senha', '/conquistas/:path*', '/api/:path*',
    ].map(source => ({
      // Login, personal data and token-based pages are not search results.
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }))];
  },
};
export default nextConfig;
