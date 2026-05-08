import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto'; // Edge compatible crypto? Actually next-on-pages handles this.

export const runtime = 'edge';

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

    // Verify HMAC signature
    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
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
