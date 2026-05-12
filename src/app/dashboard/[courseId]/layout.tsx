import Sidebar from '@/components/dashboard/Sidebar';
import { verifyUserToken } from '@/lib/auth';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyId: string };
}) {
  // Gerçek Whop Entegrasyonu: Token kontrolü
  const { user, error } = await verifyUserToken();
  
  // Şimdilik lokal geliştirme modunda hata fırlatmadan mock data ile devam ediyoruz.
  // Canlıda (Vercel/Cloudflare) eğer user yoksa 'Unauthorized' dönebilirsin.
  const isAuthorized = !!user;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        companyId={params.companyId} 
        companyName={isAuthorized ? "My Whop Store" : "Demo Store"} 
      />
      <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}
