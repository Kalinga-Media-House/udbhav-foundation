export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  providerResponse: Record<string, unknown>;
}

export interface PaymentRefund {
  refundId: string;
  status: string;
  providerResponse: Record<string, unknown>;
}

export interface PaymentProvider {
  /** Creates a new payment order for the specified amount. */
  createOrder(amount: number, currency: string, receiptId: string, notes?: Record<string, unknown>): Promise<PaymentOrder>;
  
  /** Verifies a client-side payment signature. */
  verifyPayment(orderId: string, paymentId: string, signature: string): boolean;
  
  /** Verifies a server-to-server webhook signature. */
  verifyWebhook(payload: string, signature: string, secret: string): boolean;
  
  /** Initiates a refund for a previously captured payment. */
  refundPayment(paymentId: string, amount: number, notes?: Record<string, unknown>): Promise<PaymentRefund>;
  
  /** Manually captures an authorized payment (if required by provider). */
  capturePayment(paymentId: string, amount: number, currency: string): Promise<Record<string, unknown>>;
  
  /** Retrieves the latest status of a payment. */
  getPaymentStatus(paymentId: string): Promise<{ status: string; providerResponse: Record<string, unknown> }>;
}
