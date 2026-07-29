'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface CampaignData {
  id: string;
  title: string;
  target_amount?: number;
  raised_amount?: number;
  status: string;
  start_date?: string;
  end_date?: string;
}

export function CampaignsTable({ campaigns = [] }: { campaigns?: CampaignData[] }) {
  // If no campaigns are passed, use mock data
  const data = campaigns.length > 0 ? campaigns : [
    {
      id: '1',
      title: 'Education for All 2026',
      target_amount: 500000,
      raised_amount: 150000,
      status: 'Active',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
    },
    {
      id: '2',
      title: 'Healthcare Camp Summer',
      target_amount: 200000,
      raised_amount: 210000,
      status: 'Completed',
      start_date: '2026-04-01',
      end_date: '2026-06-30',
    },
    {
      id: '3',
      title: 'Rural Development Drive',
      target_amount: 1000000,
      raised_amount: 50000,
      status: 'Active',
      start_date: '2026-07-01',
      end_date: '2027-06-30',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="p-4 font-semibold text-sm text-gray-600">Campaign Title</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Target</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Raised</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Progress</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Status</th>
            <th className="p-4 font-semibold text-sm text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                No campaigns found.
              </td>
            </tr>
          ) : (
            data.map((campaign) => {
              const target = campaign.target_amount || 0;
              const raised = campaign.raised_amount || 0;
              const progress = target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;

              return (
                <tr key={campaign.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{campaign.title}</div>
                    <div className="text-xs text-gray-500">
                      {campaign.start_date} to {campaign.end_date || 'Ongoing'}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    ₹{target.toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    ₹{raised.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 font-medium w-8">{progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Details</Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
