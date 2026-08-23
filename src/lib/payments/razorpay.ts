/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';

import Razorpay from 'razorpay';

import type { PaymentProvider, PaymentOrder, PaymentRefund } from './provider';

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
  });
};

export class RazorpayProvider implements PaymentProvider {
  async createOrder(amount: number, currency: string, receiptId: string, notes?: Record<string, unknown>): Promise<PaymentOrder> {
    const rzp = getRazorpayInstance();
    const order = await (rzp.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receiptId,
      notes: notes as any,
    }) as Promise<any>);
    return {
      orderId: order.id,
      amount: Number(order.amount) / 100,
      currency: order.currency,
      providerResponse: order as unknown as Record<string, unknown>,
    };
  }

  verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
    return expectedSignature === signature;
  }

  verifyWebhook(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return expectedSignature === signature;
  }

  async refundPayment(paymentId: string, amount: number, notes?: Record<string, unknown>): Promise<PaymentRefund> {
    const rzp = getRazorpayInstance();
    const refund = await (rzp.payments.refund(paymentId, {
      amount: Math.round(amount * 100),
      notes: notes as any,
    }) as Promise<any>);
    return {
      refundId: refund.id,
      status: refund.status,
      providerResponse: refund as unknown as Record<string, unknown>,
    };
  }

  async capturePayment(paymentId: string, amount: number, currency: string): Promise<Record<string, unknown>> {
    const rzp = getRazorpayInstance();
    const capture = await rzp.payments.capture(paymentId, Math.round(amount * 100), currency);
    return capture as unknown as Record<string, unknown>;
  }

  async getPaymentStatus(paymentId: string): Promise<{ status: string; providerResponse: Record<string, unknown> }> {
    const rzp = getRazorpayInstance();
    const payment = await rzp.payments.fetch(paymentId);
    return {
      status: payment.status,
      providerResponse: payment as unknown as Record<string, unknown>,
    };
  }
}
