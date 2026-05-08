import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cloudflare Pages için gerekli
  output: 'export',
  // Ancak @cloudflare/next-on-pages bunu kendisi handle ediyor.
  // output: 'export' yerine next-on-pages'in SSR modunu kullanıyoruz.
  // Şimdilik SSR ve Edge Runtime destekli mode:
  images: {
    // Cloudflare Pages'de Image Optimization yok, loader kullan
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.whop.com' },
      { protocol: 'https', hostname: 'whop.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Whop iframe içinde açılabilmesi için ALLOWALL
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Cloudflare güvenlik header'ları
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
