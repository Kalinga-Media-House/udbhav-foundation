import { NextResponse } from 'next/server';

import { donationsService } from '@/features/donations/service';
import { serverLogger } from '@/lib/logger/server-logger';
import { getPaymentProvider } from '@/lib/payments/factory';
import { createAdminClient } from '@/lib/supabase/admin'; 

export async function POST(req: Request) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      serverLogger.warn('Missing Razorpay signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const provider = getPaymentProvider();
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
    
    // 1. Verify Webhook Signature
    const isValid = provider.verifyWebhook(payload, signature, secret);
    if (!isValid) {
      serverLogger.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(payload);
    // Razorpay sends event id either in headers or inside the payload
    const eventId = req.headers.get('x-razorpay-event-id') || event.event_id || event.id || `evt_${Date.now()}`;
    const eventType = event.event;
    
    if (!eventId) {
        return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
    }

    // 2. Idempotency Check using Admin Client (Bypasses RLS)
    const supabaseAdmin = createAdminClient();
    const { data: existingWebhook } = await supabaseAdmin
      .from('payment_webhooks')
      .select('id')
      .eq('gateway_event_id', eventId)
      .single();

    if (existingWebhook) {
      serverLogger.info(`Webhook event ${eventId} already processed, ignoring.`);
      return NextResponse.json({ status: 'ok', message: 'Already processed' });
    }

    // 3. Process Event
    if (eventType === 'payment.captured' || eventType === 'payment.authorized') {
      const paymentEntity = event.payload.payment.entity;
      const gatewayTxId = paymentEntity.id;
      const orderId = paymentEntity.order_id;
      
      // Find donation by gateway_order_id
      const { data: donationData } = await supabaseAdmin
        .from('donations')
        .select('id, status')
        .eq('gateway_order_id', orderId)
        .single();
        
      if (donationData && donationData.status !== 'Paid') {
          // Process downstream actions
          await donationsService.markPaid(donationData.id, gatewayTxId, eventId);
      }
    } 

    // 4. Record Webhook immutably
    await supabaseAdmin.from('payment_webhooks').insert({
      provider: 'Razorpay',
      event_type: eventType,
      gateway_event_id: eventId,
      payload: event,
      headers: Object.fromEntries(req.headers.entries()),
      signature,
      is_verified: true,
      is_processed: true,
      processed_at: new Date().toISOString()
    });

    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    serverLogger.error('Webhook processing failed', error as Error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
