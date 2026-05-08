import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Whop Pilot — Elite CEO Dashboard',
  description: 'AI-powered business intelligence for Whop creators. Retention alerts, churn prevention, revenue recovery, and strategic insights.',
  keywords: 'whop, creator dashboard, retention, churn, revenue recovery, AI insights',
  openGraph: {
    title: 'Whop Pilot — Elite CEO Dashboard',
    description: 'AI-powered business intelligence for Whop creators.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="noise-overlay" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
