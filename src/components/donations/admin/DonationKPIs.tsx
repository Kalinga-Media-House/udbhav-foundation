import { IndianRupee, TrendingUp, Users, Heart } from 'lucide-react';
import React from 'react';

export function DonationKPIs() {
  const kpis = [
    {
      title: 'Total Donations',
      value: '₹12,45,000',
      change: '+15%',
      trend: 'up',
      icon: IndianRupee,
    },
    {
      title: 'Active Campaigns',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Unique Donors',
      value: '1,240',
      change: '+5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Monthly Recurring',
      value: '₹1,25,000',
      change: '+12%',
      trend: 'up',
      icon: Heart,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change}
              </span>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{kpi.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
