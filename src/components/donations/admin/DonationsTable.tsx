'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface DonationData {
  id: string;
  donation_number: string;
  donor_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  is_80g_eligible: boolean;
}

export function DonationsTable({ donations = [] }: { donations?: DonationData[] }) {
  const data = donations.length > 0 ? donations : [
    {
      id: 'd1',
      donation_number: 'DON-2026-0001',
      donor_name: 'Anjali Sharma',
      amount: 5000,
      currency: 'INR',
      status: 'Paid',
      created_at: '2026-07-28T10:30:00Z',
      is_80g_eligible: true,
    },
    {
      id: 'd2',
      donation_number: 'DON-2026-0002',
      donor_name: 'Rajesh Kumar',
      amount: 15000,
      currency: 'INR',
      status: 'Pending',
      created_at: '2026-07-27T14:15:00Z',
      is_80g_eligible: true,
    },
    {
      id: 'd3',
      donation_number: 'DON-2026-0003',
      donor_name: 'Anonymous Donor',
      amount: 2500,
      currency: 'INR',
      status: 'Paid',
      created_at: '2026-07-26T09:45:00Z',
      is_80g_eligible: false,
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'successful':
        return 'default'; // In this system, 'default' or custom green could be used. Standard is 'default' / primary.
      case 'pending':
        return 'secondary';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="p-4 font-semibold text-sm text-gray-600">ID / Date</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Donor</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Amount</th>
            <th className="p-4 font-semibold text-sm text-gray-600">80G Status</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Status</th>
            <th className="p-4 font-semibold text-sm text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                No donations found.
              </td>
            </tr>
          ) : (
            data.map((donation) => (
              <tr key={donation.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-sm text-gray-900 font-mono">{donation.donation_number}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(donation.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4 font-medium text-gray-900 text-sm">
                  {donation.donor_name}
                </td>
                <td className="p-4 text-sm font-semibold text-gray-900">
                  {donation.currency === 'INR' ? '₹' : donation.currency}{donation.amount.toLocaleString()}
                </td>
                <td className="p-4 text-sm">
                  {donation.is_80g_eligible ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium">Eligible</span>
                  ) : (
                    <span className="text-gray-500 bg-gray-50 px-2 py-1 rounded-md text-xs font-medium">N/A</span>
                  )}
                </td>
                <td className="p-4">
                  <Badge variant={getStatusVariant(donation.status)}>
                    {donation.status}
                  </Badge>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button variant="outline" size="sm">View</Button>
                  {donation.is_80g_eligible && donation.status.toLowerCase() === 'paid' && (
                    <Button variant="outline" size="sm">Receipt</Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
