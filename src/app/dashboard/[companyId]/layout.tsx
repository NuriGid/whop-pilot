import Sidebar from '@/components/dashboard/Sidebar';
import { verifyUserToken } from '@/lib/auth';

// Cloudflare Pages: Bu route Edge Runtime'da çalışmalı (next-on-pages gereksinimi)
export const runtime = 'edge';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const { user } = await verifyUserToken();
  const isAuthorized = !!user;

  // Doğrudan REST API ile şirket ismini çek (SDK yerine — Edge uyumluluğu)
  let storeName = isAuthorized ? "My Whop Store" : "Demo Store";
  try {
    const apiKey = process.env.WHOP_API_KEY;
    if (apiKey) {
      const res = await fetch(`https://api.whop.com/api/v1/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const company = await res.json();
        if (company?.title) {
          storeName = company.title;
        }
      }
    }
  } catch (error) {
    console.error("Layout failed to fetch company name:", error);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        companyId={companyId} 
        courseName={storeName} 
      />
      <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}
