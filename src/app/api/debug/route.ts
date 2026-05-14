import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const results: Record<string, unknown> = {};

  // 1. Ortam değişkeni var mı?
  const apiKey = process.env.WHOP_API_KEY;
  results.hasApiKey = !!apiKey;
  results.apiKeyPrefix = apiKey ? apiKey.substring(0, 8) + '...' : 'NOT SET';

  // 2. Genel internet erişimi var mı?
  try {
    const extRes = await fetch('https://httpbin.org/get', { signal: AbortSignal.timeout(5000) });
    results.internetAccess = { ok: extRes.ok, status: extRes.status };
  } catch (e) {
    results.internetAccess = { error: e instanceof Error ? e.message : String(e) };
  }

  // 3. Whop API'ye erişim var mı?
  try {
    const whopRes = await fetch('https://api.whop.com/api/v1/me', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });
    const whopBody = await whopRes.text();
    results.whopApi = { ok: whopRes.ok, status: whopRes.status, body: whopBody.substring(0, 200) };
  } catch (e) {
    results.whopApi = { error: e instanceof Error ? e.message : String(e) };
  }

  // 4. Şirket verisini çekebiliyor muyuz?
  try {
    const companyRes = await fetch('https://api.whop.com/api/v1/companies/biz_hRcZv2fxhfD0um', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });
    const companyBody = await companyRes.text();
    results.companyFetch = { ok: companyRes.ok, status: companyRes.status, body: companyBody.substring(0, 200) };
  } catch (e) {
    results.companyFetch = { error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json(results);
}
