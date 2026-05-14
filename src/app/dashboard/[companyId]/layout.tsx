import Sidebar from '@/components/dashboard/Sidebar';
import { verifyUserToken } from '@/lib/auth';
import { getWhopClient } from '@/lib/whop';

// Cloudflare Pages: Bu route Edge Runtime'da çalışmalı (next-on-pages gereksinimi)
export const runtime = 'edge';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
}) {
  // Next 15: params artık async, await ile aç (App Router breaking change)
  const { companyId } = await params;

  // Gerçek Whop Entegrasyonu: Token kontrolü
  const { user } = await verifyUserToken();

  // Şimdilik lokal geliştirme modunda hata fırlatmadan mock data ile devam ediyoruz.
  const isAuthorized = !!user;

  let storeName = isAuthorized ? "My Whop Store" : "Demo Store";
  try {
    const whopClient = getWhopClient();
    const company = await whopClient.companies.retrieve(companyId);
    if (company?.title) {
      storeName = company.title;
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
