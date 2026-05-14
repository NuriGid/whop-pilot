import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Whop REST API'ye doğrudan fetch ile istek at (SDK yerine — Edge uyumluluğu için)
async function whopFetch(path: string) {
  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) throw new Error('WHOP_API_KEY not set');

  const res = await fetch(`https://api.whop.com/api/v1${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Whop API ${res.status}: ${errBody}`);
  }

  return res.json();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'companyId gerekli' }, { status: 400 });
    }

    // Paralel olarak şirket bilgisi ve ödemeleri çek
    const [company, paymentsData] = await Promise.all([
      whopFetch(`/companies/${companyId}`),
      whopFetch(`/payments?company_id=${companyId}`),
    ]);

    const payments = paymentsData?.data ?? paymentsData ?? [];
    const paymentList = Array.isArray(payments) ? payments : [];

    // Toplam geliri hesapla (Whop API total'ı dolar cinsinden döndürüyor)
    let totalRevenue = 0;
    paymentList.forEach((p: { total?: number; usd_total?: number }) => {
      const amount = p.usd_total ?? p.total ?? 0;
      totalRevenue += amount;
    });

    // Üye sayısı (member_count company objesinde var)
    const memberCount = company?.member_count ?? paymentList.length;

    return NextResponse.json({
      companyId,
      courseName: company?.title || 'My Store',
      activeMembers: memberCount,
      totalRevenue: Math.round(totalRevenue),
      mrr: Math.round(totalRevenue),
      churnRate: 0,
      recoveredRevenue: 0,
      ltv: memberCount > 0 ? Math.round(totalRevenue / memberCount) : 0,
      atRiskPercent: 0,
      chapterCount: 0,
      lessonCount: 0,
      avgCompletion: 0,
      atRiskCount: 0,
    });
  } catch (error) {
    console.error('Whop API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch data',
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
