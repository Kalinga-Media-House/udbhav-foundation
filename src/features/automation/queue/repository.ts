import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database/database.generated';

type BackgroundJobInsert = Database['public']['Tables']['background_jobs']['Insert'];
type BackgroundJobRow = Database['public']['Tables']['background_jobs']['Row'];
type BackgroundJobUpdate = Database['public']['Tables']['background_jobs']['Update'];

export const BackgroundJobRepository = {
  async enqueueJob(job: BackgroundJobInsert): Promise<BackgroundJobRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('background_jobs')
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateJob(id: string, updates: BackgroundJobUpdate): Promise<BackgroundJobRow> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('background_jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  
  async getNextJob(): Promise<BackgroundJobRow | null> {
    const supabase = await createClient();
    // In a real high-throughput scenario you would use Postgres SKIP LOCKED
    // Here we are simply fetching the next queued job, or one that is due for retry
    const { data, error } = await supabase
      .from('background_jobs')
      .select('*')
      .or('status.eq.queued,and(status.eq.failed,next_retry_at.lte.now())')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
