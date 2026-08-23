import { Building, Link2, DollarSign, Mail, Search, ShieldCheck, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { SocialMediaSettings } from '@/components/admin/settings/SocialMediaSettings';
import { YouTubeSettings } from '@/components/admin/settings/YouTubeSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteLinksRepository } from '@/features/site-links/repository';
import { socialLinksRepository } from '@/features/social-links/repository';

import type { SocialLinkRow } from '@/features/social-links/repository';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminSettingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const section = (params.section as string) || 'foundation';

  let youtubeSetting = null;
  if (section === 'youtube') {
    youtubeSetting = await siteLinksRepository.getBySlug('youtube_channel');
  }

  let socialLinks: SocialLinkRow[] = [];
  if (section === 'social') {
    socialLinks = await socialLinksRepository.getAll();
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Settings</h1>
        <p className="mt-1 text-gray-500">
          Configure foundation details, integrations, and global platform preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Settings Navigation */}
        <div className="col-span-1">
          <nav className="flex flex-col space-y-1">
            <Link
              href="?section=foundation"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'foundation' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Building className="h-4 w-4" /> Foundation
            </Link>
            <Link
              href="?section=social"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'social' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Link2 className={`h-4 w-4 ${section === 'social' ? 'text-indigo-700' : 'text-gray-400'}`} /> Social Links
            </Link>
            <Link
              href="?section=donation"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'donation' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <DollarSign className={`h-4 w-4 ${section === 'donation' ? 'text-indigo-700' : 'text-gray-400'}`} /> Donation
            </Link>
            <Link
              href="?section=email"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'email' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Mail className={`h-4 w-4 ${section === 'email' ? 'text-indigo-700' : 'text-gray-400'}`} /> Email
            </Link>
            <Link
              href="?section=seo"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'seo' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Search className={`h-4 w-4 ${section === 'seo' ? 'text-indigo-700' : 'text-gray-400'}`} /> SEO
            </Link>
            <Link
              href="?section=security"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <ShieldCheck className={`h-4 w-4 ${section === 'security' ? 'text-indigo-700' : 'text-gray-400'}`} /> Security
            </Link>
            <Link
              href="?section=youtube"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${section === 'youtube' ? 'bg-indigo-50 text-red-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <PlayCircle className={`h-4 w-4 ${section === 'youtube' ? 'text-red-600' : 'text-red-500'}`} /> YouTube Channel
            </Link>
          </nav>
        </div>

        {/* Settings Forms */}
        <div className="col-span-1 space-y-8 md:col-span-2">
          {section === 'youtube' && <YouTubeSettings initialData={youtubeSetting} />}
          {section === 'social' && <SocialMediaSettings initialLinks={socialLinks} />}
          {section === 'foundation' && <FoundationSettings />}
          {section === 'donation' && <DonationSettings />}
          {section === 'email' && <EmailSettings />}
          {section === 'seo' && <SEOSettings />}
          {section === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function FoundationSettings() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Foundation Details</h2>
        <p className="text-sm text-gray-500">
          Basic organization information displayed publicly.
        </p>
      </div>
      <div className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Foundation Name</label>
            <Input defaultValue="UDBHAV Foundation" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <Input defaultValue="contact@udbhavfoundation.org" type="email" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <Input defaultValue="+91 98765 43210" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Website</label>
            <Input defaultValue="https://udbhavfoundation.org" />
          </div>
          <div className="col-span-1 space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Physical Address</label>
            <textarea
              className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="123 NGO Lane, Community Center, Bhubaneswar, Odisha 751001"
            />
          </div>
          <div className="col-span-1 space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Logo & Favicon</label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-xs text-gray-400">
                Logo
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-xs text-gray-400">
                Fav
              </div>
              <Button variant="outline" size="sm">
                Upload New
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        <Button>Save Changes</Button>
      </div>
    </section>
  );
}

function DonationSettings() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Donation Settings</h2>
        <p className="text-sm text-gray-500">
          Configure payment gateways and receipt details.
        </p>
      </div>
      <div className="space-y-5 p-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Primary Payment Gateway</label>
          <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option>Razorpay</option>
            <option>Stripe</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            UPI ID for Direct Transfers
          </label>
          <Input defaultValue="udbhav@upi" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Bank Account Details (Displayed on Invoice)
          </label>
          <textarea
            className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            defaultValue="Bank Name: State Bank of India\nAccount Name: UDBHAV Foundation\nAccount No: 12345678901\nIFSC: SBIN0001234"
          />
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Auto-Generate 80G Receipts</p>
            <p className="text-xs text-gray-500">
              Automatically send tax exemption receipts upon successful donation.
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
          </label>
        </div>
      </div>
      <div className="flex justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        <Button>Save Changes</Button>
      </div>
    </section>
  );
}

function EmailSettings() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Email Settings</h2>
      </div>
      <div className="space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">SMTP Provider</label>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option>Resend</option>
              <option>AWS SES</option>
              <option>SendGrid</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Sender Name</label>
            <Input defaultValue="UDBHAV Foundation" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Reply-To Email</label>
            <Input defaultValue="no-reply@udbhavfoundation.org" />
          </div>
        </div>
      </div>
      <div className="flex justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        <Button>Save Changes</Button>
      </div>
    </section>
  );
}

function SEOSettings() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">SEO Preferences</h2>
      </div>
      <div className="space-y-4 p-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Default Site Title</label>
          <Input defaultValue="UDBHAV Foundation | Empowering Communities" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Default Meta Description
          </label>
          <textarea
            className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            defaultValue="UDBHAV Foundation is a non-profit organization dedicated to empowering marginalized communities through education and healthcare."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Analytics Measurement ID
          </label>
          <Input defaultValue="G-XXXXXXXXXX" />
        </div>
      </div>
      <div className="flex justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        <Button>Save Changes</Button>
      </div>
    </section>
  );
}

function SecuritySettings() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Security</h2>
      </div>
      <div className="space-y-4 p-6">
        <Button variant="outline" className="w-full justify-start text-left">
          Update Admin Password
        </Button>
        <Button variant="outline" className="w-full justify-start text-left">
          Configure Two-Factor Authentication (2FA)
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start border-red-200 text-left text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          Terminate All Active Sessions
        </Button>
      </div>
    </section>
  );
}
