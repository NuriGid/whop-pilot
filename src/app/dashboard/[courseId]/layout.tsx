import Sidebar from '@/components/dashboard/Sidebar';
import { verifyUserToken } from '@/lib/auth';

// Cloudflare Pages: Bu route Edge Runtime'da çalışmalı (next-on-pages gereksinimi)


export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  // Next 15: params artık async, await ile aç (App Router breaking change)
  const { courseId } = await params;

  // Gerçek Whop Entegrasyonu: Token kontrolü
  const { user } = await verifyUserToken();

  // Şimdilik lokal geliştirme modunda hata fırlatmadan mock data ile devam ediyoruz.
  // Canlıda (Vercel/Cloudflare) eğer user yoksa 'Unauthorized' dönebilirsin.
  const isAuthorized = !!user;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        courseId={courseId} 
        courseName={isAuthorized ? "My Whop Course" : "Demo Course"} 
      />
      <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}
