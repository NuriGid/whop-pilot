import { NextRequest, NextResponse } from 'next/server';
import { getWhopClient } from '@/lib/whop';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const companyId = searchParams.get('companyId');

    const whopClient = getWhopClient();

    if (companyId) {
      const [company, paymentsRes] = await Promise.all([
        whopClient.companies.retrieve(companyId),
        whopClient.payments.list({ company_id: companyId }),
      ]);

      const payments = paymentsRes.data ?? [];
      
      // Toplam geliri hesapla (örneğin payment objesindeki amount üzerinden)
      // Whop API amount'u cent cinsinden (örn: 1500 = $15.00) döndürebilir
      let totalRevenueCents = 0;
      payments.forEach(p => {
        // @ts-ignore
        if (p.total) {
          // @ts-ignore
          totalRevenueCents += p.total;
        }
      });
      
      const totalRevenueStr = `$${(totalRevenueCents / 100).toLocaleString('en-US')}`;

      return NextResponse.json({
        companyId,
        courseName: company.title || 'My Store',
        totalStudents: payments.length, // Şimdilik ödeme sayısını üye sayısı kabul ediyoruz
        activeMembers: payments.length,
        totalRevenueStr,
        // Mock veri kalıntılarını eziyoruz
        atRiskPercent: 0,
        chapterCount: 0,
        lessonCount: 0,
        avgCompletion: 0,
        atRiskCount: 0,
      });
    }

    return NextResponse.json({ error: 'courseId veya companyId gerekli' }, { status: 400 });
  } catch (error) {
    console.error('Whop API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
