import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const results: Record<string, unknown> = {};
  
  // Step 1: API route çalışıyor mu?
  results.step1_route_works = true;
  
  // Step 2: Env var var mı?
  const apiKey = process.env.WHOP_API_KEY;
  results.step2_has_key = !!apiKey;
  
  // Step 3: Basit bir dış siteye erişim
  try {
    const r = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await r.json();
    results.step3_internet = { ok: true, title: data.title };
  } catch (e) {
    results.step3_internet = { ok: false, error: String(e) };
  }
  
  // Step 4: Whop API (tek basit istek)
  if (apiKey) {
    try {
      const r = await fetch('https://api.whop.com/api/v1/companies/biz_hRcZv2fxhfD0um', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const data = await r.json();
      results.step4_whop = { ok: r.ok, status: r.status, title: data.title };
    } catch (e) {
      results.step4_whop = { ok: false, error: String(e) };
    }
  }
  
  return NextResponse.json(results);
}
