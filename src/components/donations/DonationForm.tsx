"use client";

import { HeartHandshake, ShieldCheck, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DonationFormProps {
  campaignId?: string;
  campaignName?: string;
}

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

export function DonationForm({ campaignName }: DonationFormProps) {
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setCustomAmount(val);
      if (val) setAmount(parseInt(val, 10));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to DonationsService
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Card className="rounded-3xl border-none shadow-xl bg-white overflow-hidden text-center py-12 px-6">
        <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#3C9D23]" />
        </div>
        <h3 className="text-2xl font-heading font-bold text-[#172B6B] mb-3">
          Thank you for your generosity!
        </h3>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Your donation of ₹{amount} has been received. Your support helps us create lasting change. A receipt has been sent to your email.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-xl">
          Make another donation
        </Button>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-none shadow-xl bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-[#172B6B] to-[#12245F] p-6 text-white text-center">
        <HeartHandshake className="w-8 h-8 mx-auto mb-3 opacity-90" />
        <h3 className="text-2xl font-heading font-bold mb-2">
          {campaignName ? `Support ${campaignName}` : "Make a Donation"}
        </h3>
        <p className="text-white/80 text-sm">
          Join us in making a difference today.
        </p>
      </div>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Frequency Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setFrequency('one-time')}
              className={cn(
                "flex-1 py-3 text-sm font-semibold rounded-lg transition-all",
                frequency === 'one-time' ? "bg-white text-[#172B6B] shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              One-Time
            </button>
            <button
              type="button"
              onClick={() => setFrequency('monthly')}
              className={cn(
                "flex-1 py-3 text-sm font-semibold rounded-lg transition-all",
                frequency === 'monthly' ? "bg-white text-[#172B6B] shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Monthly
            </button>
          </div>

          {/* Amount Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Select Amount (₹)</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAmountSelect(preset)}
                  className={cn(
                    "py-3 rounded-xl border-2 text-lg font-bold transition-all",
                    amount === preset && !customAmount
                      ? "border-[#3C9D23] bg-green-50 text-[#3C9D23]"
                      : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                  )}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
            
            <div className="relative mt-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-lg">
                ₹
              </span>
              <Input
                type="text"
                placeholder="Custom Amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className={cn(
                  "pl-8 py-6 rounded-xl border-2 text-lg transition-all shadow-none",
                  customAmount ? "border-[#3C9D23] ring-0" : "border-gray-100 focus-visible:border-[#172B6B] focus-visible:ring-0"
                )}
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4 pt-2">
            <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Your Details</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input required placeholder="Full Name" className="py-5 rounded-xl bg-gray-50/50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <Input required type="email" placeholder="Email Address" className="py-5 rounded-xl bg-gray-50/50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <Input required type="tel" placeholder="Phone Number" className="py-5 rounded-xl bg-gray-50/50 border-gray-200" />
              </div>
              <div className="space-y-2">
                <Input placeholder="PAN (For 80G Tax Exemption)" className="py-5 rounded-xl bg-gray-50/50 border-gray-200" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !amount}
              className="w-full bg-[#172B6B] hover:bg-[#101F55] text-white py-6 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {isSubmitting ? "Processing..." : `Donate ₹${amount || 0}`}
            </Button>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Secure, encrypted checkout. 80G Tax exemption available.</span>
            </div>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
