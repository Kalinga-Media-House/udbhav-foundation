
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'sb_service_role_local_dev_key_do_not_use_in_prod_32c';

async function fetchSupabase(table, method = 'GET', body = null) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method,
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    return { error: err || res.statusText };
  }
  const data = await res.json().catch(()=>null);
  return { data, error: null };
}

async function verify() {
  console.log("--- 1. DATABASE SCHEMA ---");
  const tables = ['donors', 'contacts', 'financial_ledger', 'donation_refunds', 'tax_receipts', 'payment_webhooks'];
  for (const t of tables) {
    const { error } = await fetchSupabase(`${t}?select=id&limit=1`);
    if (error) {
      console.log(`Table ${t} Error:`, JSON.stringify(error));
    } else {
      console.log(`Table ${t} EXISTS`);
    }
  }

  console.log("\n--- 2. WEBHOOK IDEMPOTENCY ---");
  const eventId = "test_evt_123_" + Date.now();
  const payload = {
    provider: 'Razorpay',
    event_type: 'payment.captured',
    gateway_event_id: eventId,
    payload: { test: true },
    headers: {},
    is_verified: true,
    is_processed: true
  };
  const res1 = await fetchSupabase('payment_webhooks', 'POST', payload);
  console.log("First webhook insert:", res1.error ? JSON.stringify(res1.error) : 'SUCCESS');
  
  const res2 = await fetchSupabase('payment_webhooks', 'POST', payload);
  console.log("Duplicate webhook insert:", res2.error ? JSON.stringify(res2.error) : 'SUCCESS');

  console.log("\n--- 3. FINANCIAL LEDGER & RECEIPTS ---");
  
  // Create contact
  const { data: contacts } = await fetchSupabase('contacts', 'POST', { email: `test${Date.now()}@udbhav.org`, first_name: 'Test' });
  const contact = contacts?.[0];
  if (contact) {
      // Create donation
      const { data: donations } = await fetchSupabase('donations', 'POST', {
          donation_number: 'TEST-' + Date.now(),
          contact_id: contact.id,
          amount: 1000,
          is_80g_eligible: true,
          status: 'Pending',
          currency: 'INR'
      });
      const donation = donations?.[0];
      
      if (donation) {
          // Ledger entry
          await fetchSupabase('financial_ledger', 'POST', {
              donation_id: donation.id,
              event_type: 'Donation Created',
              amount: 1000
          });
          
          await fetchSupabase('financial_ledger', 'POST', {
              donation_id: donation.id,
              event_type: 'Refund Requested',
              amount: -1000
          });

          // Fetch ledger
          const { data: ledger } = await fetchSupabase(`financial_ledger?donation_id=eq.${donation.id}&select=event_type,amount`);
          console.log("Ledger Entries:", JSON.stringify(ledger));

          // Test Receipt RPC
          const resRpc = await fetch(`${supabaseUrl}/rest/v1/rpc/generate_receipt_number`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          });
          const receipt = await resRpc.json();
          console.log("Generated Receipt:", receipt);
      }
  }

}

verify().catch(console.error);
