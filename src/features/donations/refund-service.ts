/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatabaseError } from '@/errors';
import { serverLogger } from '@/lib/logger/server-logger';
import { getPaymentProvider } from '@/lib/payments/factory';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ID } from '@/types';

import { donationsRepository } from './repository';


export class RefundService {
  async issueRefund(donationId: ID, amount: number, reason: string, processedBy?: ID): Promise<boolean> {
    try {
      const supabase = await createServerSupabaseClient();
      
      const { data: donation, error: findError } = await donationsRepository.findDonationById(donationId);
      if (findError || !donation) throw new Error('Donation not found');
      
      if (!donation.gateway_transaction_id) throw new Error('Cannot refund donation without gateway transaction ID');

      const provider = getPaymentProvider();
      const refundResult = await provider.refundPayment(donation.gateway_transaction_id, amount, { reason });

      const refundData = {
        donation_id: donationId,
        refund_amount: amount,
        reason,
        gateway_refund_id: refundResult.refundId,
        status: refundResult.status === 'processed' ? 'Refunded' : 'Refund Pending',
        processed_by: processedBy || null,
        processed_at: new Date().toISOString()
      };

      const { error: insertError } = await (supabase as any).from('donation_refunds').insert(refundData);
      if (insertError) throw new DatabaseError(insertError.message);

      // Update donation status if fully refunded
      if (amount >= donation.amount) {
        await donationsRepository.updateDonation(donationId, { status: 'Refunded' });
      }

      // Append to immutable ledger
      await donationsRepository.appendLedgerEvent(donationId, 'Refund Requested', -amount, donation.currency, refundResult.refundId, { reason });

      return true;
    } catch (error) {
      serverLogger.error('RefundService.issueRefund failed', error as Error);
      return false;
    }
  }
}

export const refundService = new RefundService();
