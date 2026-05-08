import { NextRequest, NextResponse } from 'next/server';
import { mockAIInsights } from '@/lib/mock-data';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { metrics, companyName } = await req.json();

    if (!metrics || !companyName) {
      return NextResponse.json({ error: 'Missing metrics or companyName' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey || groqKey === 'your_groq_api_key_here') {
      // Return mock data when no API key is configured
      return NextResponse.json({ insights: mockAIInsights, source: 'mock' });
    }

    const { generateCEOInsights } = await import('@/lib/groq');
    const insights = await generateCEOInsights(metrics, companyName);
    return NextResponse.json({ insights, source: 'groq' });

  } catch (error) {
    console.error('AI insights error:', error);
    // Graceful fallback to mock data
    return NextResponse.json({ insights: mockAIInsights, source: 'fallback' });
  }
}
