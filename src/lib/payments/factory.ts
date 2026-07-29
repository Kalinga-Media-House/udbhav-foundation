import type { PaymentProvider } from './provider';
import { RazorpayProvider } from './razorpay';

export function getPaymentProvider(): PaymentProvider {
  const providerType = process.env.PAYMENT_PROVIDER || 'razorpay';
  
  switch (providerType.toLowerCase()) {
    case 'razorpay':
      return new RazorpayProvider();
    default:
      throw new Error(`Unsupported payment provider: ${providerType}`);
  }
}
