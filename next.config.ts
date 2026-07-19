import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Cloudflare Pages deploy via @cloudflare/next-on-pages (SSR + Edge Runtime).
  // Deliberately NOT using `output: 'export'` — the /api/* routes hold the
  // WHOP_API_KEY and GROQ_API_KEY secrets and must stay server-side.
  images: {
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
          // Allow embedding ONLY inside Whop iframes.
          // Note: X-Frame-Options has no valid "allow" value (ALLOWALL is not
          // a real directive) — the modern, correct mechanism is CSP frame-ancestors.
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://whop.com https://*.whop.com https://*.apps.whop.com;" },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
