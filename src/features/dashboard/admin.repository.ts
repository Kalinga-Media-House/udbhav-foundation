import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface AdminDashboardKPIs {
  totalDonations: number;
  volunteers: number;
  events: number;
  programs: number;
}

export interface RevenueDataPoint {
  name: string;
  revenue: number;
}

export interface PendingApproval {
  id: string;
  realId: string;
  type: 'volunteer_application' | 'enquiry' | 'news_article';
  title: string;
  user: string;
  date: string;
  actionUrl: string;
  canApprove: boolean;
}

export interface RecentActivity {
  id: string;
  type: string;
  content: string;
  time: string;
}

export class AdminDashboardRepository {
  async getKPIs(): Promise<AdminDashboardKPIs> {
    const supabase = await createServerSupabaseClient();

    const { data: donations } = await supabase
      .from('donations')
      .select('amount')
      .in('status', ['Captured', 'Paid']);
    const totalDonations = donations?.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) || 0;

    const { count: volunteers } = await (supabase as any)
      .from('volunteers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Active')
      .eq('is_deleted', false);

    const { count: events } = await (supabase as any)
      .from('events')
      .select('*', { count: 'exact', head: true })
      .in('status', ['upcoming', 'active', 'published'])
      .eq('is_deleted', false);

    const { count: programs } = await (supabase as any)
      .from('programs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('visibility', 'public')
      .eq('is_deleted', false);

    return {
      totalDonations,
      volunteers: volunteers || 0,
      events: events || 0,
      programs: programs || 0,
    };
  }

  async getRevenueChart(months: number = 7): Promise<RevenueDataPoint[]> {
    const supabase = await createServerSupabaseClient();
    
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
    
    const { data: donations } = await supabase
      .from('donations')
      .select('amount, created_at')
      .in('status', ['Captured', 'Paid'])
      .gte('created_at', startDate.toISOString());

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const grouped = new Map<string, number>();

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]}`; 
      grouped.set(key, 0);
    }

    if (donations) {
      donations.forEach(d => {
        const date = new Date(d.created_at);
        const key = `${monthNames[date.getMonth()]}`;
        if (grouped.has(key)) {
          grouped.set(key, grouped.get(key)! + (Number(d.amount) || 0));
        }
      });
    }

    return Array.from(grouped.entries()).map(([name, revenue]) => ({ name, revenue }));
  }

  async getPendingApprovals(): Promise<PendingApproval[]> {
    const supabase = await createServerSupabaseClient();
    const approvals: PendingApproval[] = [];

    const { data: volApps } = await (supabase as any)
      .from('volunteer_applications')
      .select('id, full_name, created_at')
      .in('status', ['pending', 'Applied', 'Pending Verification'])
      .order('created_at', { ascending: false })
      .limit(5);

    if (volApps) {
      volApps.forEach((app: any) => {
        approvals.push({
          id: `vol_${app.id}`,
          realId: app.id,
          type: 'volunteer_application',
          title: 'Volunteer Application',
          user: app.full_name || 'Unknown User',
          date: app.created_at,
          actionUrl: `/admin/volunteers`, 
          canApprove: true
        });
      });
    }

    return approvals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10).map(a => ({
      ...a,
      date: new Date(a.date).toLocaleDateString()
    }));
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    const supabase = await createServerSupabaseClient();
    const { data: logs } = await (supabase as any)
      .from('activity_logs')
      .select('id, entity_type, action, created_at, actor_id, details')
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (!logs) return [];

    return logs.map((log: any) => {
      // Create a readable relative time or string
      const date = new Date(log.created_at);
      const diffMs = new Date().getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      let timeStr = `${diffMins} mins ago`;
      if (diffDays > 0) timeStr = `${diffDays} days ago`;
      else if (diffHours > 0) timeStr = `${diffHours} hours ago`;
      else if (diffMins === 0) timeStr = 'Just now';

      const type = (log.entity_type || 'system').toLowerCase();
      let content = `${log.action} ${log.entity_type}`;
      if (log.details && typeof log.details === 'object' && log.details.message) {
        content = log.details.message;
      } else if (log.action === 'INSERT') {
        content = `New ${type} created`;
      } else if (log.action === 'UPDATE') {
        content = `Updated ${type}`;
      } else if (log.action === 'DELETE') {
        content = `Deleted ${type}`;
      }

      return {
        id: log.id,
        type: type,
        content,
        time: timeStr
      };
    });
  }
}

export const adminDashboardRepository = new AdminDashboardRepository();
