import { DatabaseError } from '@/errors';
import { serverLogger } from '@/lib/logger/server-logger';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { ID } from '@/types';

export class ReceiptService {
  /**
   * Generates a tax receipt for a given donation.
   */
  async generateReceipt(donationId: ID, createdBy?: ID): Promise<string | null> {
    try {
      const supabase = await createServerSupabaseClient();
      // Generate receipt number
      const { data: receiptNumData, error: rpcError } = await (supabase.rpc as any)('generate_receipt_number');
      if (rpcError) throw new DatabaseError(rpcError.message);
      
      const receiptNumber = receiptNumData;
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const financialYear = `${currentYear}-${nextYear}`;

      const { error } = await (supabase as any).from('tax_receipts').insert({
        donation_id: donationId,
        receipt_number: receiptNumber,
        financial_year: financialYear,
        created_by: createdBy || null
      }).select().single();

      if (error) throw new DatabaseError(error.message);

      // Mark donation as receipt generated
      await (supabase.from('donations') as any).update({ receipt_generated: true }).eq('id', donationId);

      return receiptNumber;
    } catch (error) {
      serverLogger.error('ReceiptService.generateReceipt failed', error as Error);
      return null;
    }
  }
}

export const receiptService = new ReceiptService();
