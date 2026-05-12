import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Edge Runtime: Node 'crypto' yerine Web Crypto API kullan\u0131yoruz.
// timingSafeEqual yerine constant-time string compare implementasyonu.
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function hmacSha256Hex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  // Web Crypto -> ArrayBuffer -> hex
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get('x-whop-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // HMAC do\u011frulama (Web Crypto API, Edge-compatible)
    const expected = await hmacSha256Hex(webhookSecret, rawBody);

    if (!timingSafeEqualHex(signature, expected)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log('[Webhook] Received event:', event.action, event.data?.id);

    // Handle events
    switch (event.action) {
      case 'membership.went_invalid':
        console.log('[Webhook] Membership cancelled:', event.data?.id);
        // TODO: Trigger churn guard logic
        break;
      case 'payment.failed':
        console.log('[Webhook] Payment failed:', event.data?.id);
        // TODO: Add to revenue recovery queue
        break;
      case 'membership.went_valid':
        console.log('[Webhook] New member:', event.data?.id);
        break;
      default:
        console.log('[Webhook] Unhandled event:', event.action);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
