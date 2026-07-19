// Cloudflare Pages: Edge Runtime (next-on-pages requirement)
export const runtime = 'edge';

// The Sidebar now lives inside page.tsx so it can share `activeTab` state.
// This layout is a pure passthrough — no server-side auth or API calls here.
// (Company name is fetched client-side via /api/metrics.)
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
