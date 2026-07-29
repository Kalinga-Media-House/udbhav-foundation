import { Users, Target, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DonationForm } from "@/components/donations/DonationForm";
import { Container } from "@/components/shared/Container";

const CAMPAIGNS = {
  "educate-a-child": {
    title: "Educate a Child, Empower a Future",
    description: "Provide comprehensive scholarships, study materials, and mentorship to underprivileged students in rural Odisha. Your support will cover tuition fees, books, and uniforms for students who have demonstrated academic excellence but lack financial resources.",
    raised: 125000,
    goal: 500000,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    supporters: 142,
  },
  "green-earth-initiative": {
    title: "Green Earth Initiative 2026",
    description: "Join our massive plantation drive to restore local ecosystems and combat climate change through community action. Funds will be used to procure saplings of native species, organize community planting events, and ensure post-plantation care for 3 years.",
    raised: 85000,
    goal: 200000,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
    supporters: 89,
  },
  "youth-mental-health": {
    title: "Youth Mental Health Support",
    description: "Fund counseling services, awareness camps, and safe spaces for young adults struggling with mental health challenges. This initiative aims to destigmatize mental health care and provide professional psychological support free of cost.",
    raised: 45000,
    goal: 300000,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop",
    supporters: 56,
  },
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const params = await props.params;
  const campaign = CAMPAIGNS[params.slug as keyof typeof CAMPAIGNS];
  if (!campaign) return { title: "Campaign Not Found" };
  
  return {
    title: `${campaign.title} | UDBHAV Foundation`,
    description: campaign.description.substring(0, 160),
  };
}

export default async function CampaignDetailPage(props: { params: Params }) {
  const params = await props.params;
  const campaign = CAMPAIGNS[params.slug as keyof typeof CAMPAIGNS];

  if (!campaign) {
    notFound();
  }

  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);

  return (
    <main className="min-h-screen bg-gray-50/50 pb-24">
      {/* Top Banner Image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[300px]">
        <Image
          src={campaign.image}
          alt={campaign.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <Container className="absolute inset-0 flex flex-col justify-end pb-12 z-10">
          <Link 
            href="/campaigns" 
            className="inline-flex items-center text-white/80 hover:text-white font-medium mb-6 w-fit transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3C9D23] text-white text-xs font-bold tracking-wider uppercase mb-4 w-fit">
            <Target className="w-3.5 h-3.5" />
            <span>Fundraising Campaign</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white max-w-4xl tracking-tight leading-[1.1]">
            {campaign.title}
          </h1>
        </Container>
      </div>

      <Container className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Details Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-[#172B6B] mb-4">About the Campaign</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {campaign.description}
              </p>
              
              {/* Fake Content for aesthetic fullness */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Why it matters</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your support plays a crucial role in enabling us to reach more individuals and expand our on-the-ground efforts. 
                  Every rupee contributed goes directly into funding the resources necessary to implement this initiative effectively.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4 ml-2">
                  <li>Transparent allocation of all funds.</li>
                  <li>Direct impact on the beneficiaries.</li>
                  <li>Regular updates and impact reports.</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#172B6B] rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <Users className="w-48 h-48 -mb-10 -mr-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Spread the Word</h3>
              <p className="text-white/80 mb-6 max-w-md">
                Can&apos;t donate right now? Sharing this campaign with your network is just as valuable!
              </p>
              <button className="bg-white text-[#172B6B] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Share Campaign
              </button>
            </div>
          </div>

          {/* Sidebar / Donation Form */}
          <div className="lg:col-span-5 xl:col-span-4 lg:-mt-32 relative z-20">
            {/* Stats Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
              <div className="mb-6">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-extrabold text-[#3C9D23]">
                    ₹{campaign.raised.toLocaleString()}
                  </span>
                  <span className="text-gray-500 font-medium mb-1">
                    raised of ₹{campaign.goal.toLocaleString()}
                  </span>
                </div>
                
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 my-4">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#3C9D23] to-[#5CE038] transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 font-bold">{progress.toFixed(0)}% funded</span>
                  <span className="flex items-center text-gray-500 font-medium">
                    <Users className="w-4 h-4 mr-1.5" />
                    {campaign.supporters} supporters
                  </span>
                </div>
              </div>
            </div>

            {/* Reused Form */}
            <div className="sticky top-8">
              <DonationForm campaignId={params.slug} campaignName={campaign.title} />
            </div>
          </div>

        </div>
      </Container>
    </main>
  );
}
