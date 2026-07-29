'use client';

import { Download, Eye } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface TaxReceiptData {
  id: string;
  receipt_number: string;
  donation_number: string;
  donor_name: string;
  pan_number: string;
  amount: number;
  issue_date: string;
  status: string;
}

export function TaxReceiptsTable({ receipts = [] }: { receipts?: TaxReceiptData[] }) {
  const data = receipts.length > 0 ? receipts : [
    {
      id: 'r1',
      receipt_number: '80G-2026-0001',
      donation_number: 'DON-2026-0001',
      donor_name: 'Anjali Sharma',
      pan_number: 'ABCDE1234F',
      amount: 5000,
      issue_date: '2026-07-28',
      status: 'Issued',
    },
    {
      id: 'r2',
      receipt_number: '80G-2026-0002',
      donation_number: 'DON-2026-0004',
      donor_name: 'Vikram Singh',
      pan_number: 'VWXYZ5678G',
      amount: 50000,
      issue_date: '2026-07-25',
      status: 'Issued',
    },
    {
      id: 'r3',
      receipt_number: '80G-2026-0003',
      donation_number: 'DON-2026-0007',
      donor_name: 'Priya Desai',
      pan_number: 'PQRST9012H',
      amount: 10000,
      issue_date: '2026-07-20',
      status: 'Voided',
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="p-4 font-semibold text-sm text-gray-600">Receipt No.</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Donor Details</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Related Donation</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Issue Date</th>
            <th className="p-4 font-semibold text-sm text-gray-600">Status</th>
            <th className="p-4 font-semibold text-sm text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                No tax receipts found.
              </td>
            </tr>
          ) : (
            data.map((receipt) => (
              <tr key={receipt.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-sm text-gray-900 font-mono">{receipt.receipt_number}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-900 text-sm">{receipt.donor_name}</div>
                  <div className="text-xs text-gray-500">PAN: {receipt.pan_number}</div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-mono text-blue-600 hover:underline cursor-pointer">
                    {receipt.donation_number}
                  </span>
                  <div className="text-xs text-gray-500">₹{receipt.amount.toLocaleString()}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(receipt.issue_date).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Badge variant={receipt.status === 'Issued' ? 'default' : 'secondary'}>
                    {receipt.status}
                  </Badge>
                </td>
                <td className="p-4 text-right space-x-2 flex justify-end items-center">
                  <Button variant="ghost" size="sm" title="Preview">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Download PDF">
                    <Download className="w-4 h-4 mr-1" /> PDF
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
