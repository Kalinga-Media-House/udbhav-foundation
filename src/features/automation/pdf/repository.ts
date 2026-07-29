import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database/database.generated';

type TaxReceiptInsert = Database['public']['Tables']['tax_receipts']['Insert'];
type TaxReceiptRow = Database['public']['Tables']['tax_receipts']['Row'];

export const TaxReceiptRepository = {
  async createReceipt(receipt: TaxReceiptInsert): Promise<TaxReceiptRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('tax_receipts')
      .insert(receipt)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getReceiptByDonationId(donationId: string): Promise<TaxReceiptRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('tax_receipts')
      .select('*')
      .eq('donation_id', donationId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
