import { Leaf, GraduationCap, HeartPulse } from "lucide-react";
import type { Metadata } from "next";

import { CampaignCard } from "@/components/donations/CampaignCard";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Campaigns | UDBHAV Foundation",
  description: "Explore our active campaigns and make a difference today.",
};

const CAMPAIGNS = [
  {
    title: "Educate a Child, Empower a Future",
    slug: "educate-a-child",
    description: "Provide comprehensive scholarships, study materials, and mentorship to underprivileged students in rural Odisha.",
    raised: 125000,
    goal: 500000,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
    icon: GraduationCap,
  },
  {
    title: "Green Earth Initiative 2026",
    slug: "green-earth-initiative",
    description: "Join our massive plantation drive to restore local ecosystems and combat climate change through community action.",
    raised: 85000,
    goal: 200000,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
    icon: Leaf,
  },
  {
    title: "Youth Mental Health Support",
    slug: "youth-mental-health",
    description: "Fund counseling services, awareness camps, and safe spaces for young adults struggling with mental health challenges.",
    raised: 45000,
    goal: 300000,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop",
    icon: HeartPulse,
  },
];

export default function CampaignsPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 pb-24">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#172B6B] to-[#12245F] text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#3C9D23] blur-[80px]" />
        </div>
        
        <Container className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Active <span className="text-[#3C9D23]">Campaigns</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            Discover causes that matter. Your contribution directly funds these initiatives, creating measurable impact in communities that need it most.
          </p>
        </Container>
      </section>

      {/* Campaign List */}
      <section className="relative z-20 -mt-10 sm:-mt-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAMPAIGNS.map((campaign) => (
              <CampaignCard key={campaign.slug} {...campaign} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="mt-24">
        <Container>
          <div className="bg-white rounded-3xl p-10 md:p-16 text-center border border-gray-100 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
               <HeartPulse className="w-64 h-64 -mb-16 -mr-16" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#172B6B] mb-6">
              Not sure which campaign to support?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto text-lg">
              You can make a general donation to the UDBHAV Foundation. We will allocate the funds where they are needed most urgently.
            </p>
            <a 
              href="/donate" 
              className="inline-flex items-center justify-center bg-[#3C9D23] hover:bg-[#32851d] text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Make a General Donation
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}
