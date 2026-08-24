import { CheckCircle2, ShieldCheck, HeartHandshake, Leaf, BrainCircuit } from "lucide-react";
import type { Metadata } from "next";

import { DonationForm } from "@/components/donations/DonationForm";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Support UDBHAV Foundation",
  description: "Support UDBHAV Foundation's work for education, environmental responsibility, mental well-being and inclusive community development.",
};

import { METADATA } from '@/constants/metadata';

export default function DonatePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    recipient: {
      '@type': 'NGO',
      name: 'UDBHAV Foundation',
      url: METADATA.BASE_URL,
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#172B6B] via-[#101F55] to-[#12245F] text-white pt-20 pb-40 lg:pt-28 lg:pb-48">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#3C9D23]/10 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[80px]" />
        </div>

        <Container className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-6">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Support Our Cause</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-6">
            Your Support Can Create <br />
            <span className="text-[#3C9D23]">Lasting Change.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Every contribution helps UDBHAV Foundation expand access to education, strengthen community well-being, and build a more inclusive future.
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="relative z-20 -mt-24 sm:-mt-32 pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto">
            
            {/* Form Column */}
            <div className="lg:col-span-7 xl:col-span-6">
              <DonationForm />
            </div>

            {/* Information Column */}
            <div className="lg:col-span-5 xl:col-span-6 lg:pt-12">
              <h3 className="text-sm font-bold text-[#3C9D23] tracking-widest uppercase mb-3">
                Your Trust Matters
              </h3>
              <h2 className="text-3xl font-bold text-[#172B6B] mb-6">
                Where Your Support Creates Impact
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                UDBHAV Foundation is committed to responsible, transparent, and purpose-driven use of every contribution. We channel your support directly into active grassroots initiatives.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                    <HeartHandshake className="w-6 h-6 text-[#172B6B]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#172B6B] mb-1">Education & Mentorship</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">Providing free coaching, scholarships, and career guidance to deserving students from rural and underprivileged backgrounds.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0 shadow-sm border border-green-100">
                    <Leaf className="w-6 h-6 text-[#3C9D23]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#172B6B] mb-1">Environmental Responsibility</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">Organizing massive plantation drives and ecological awareness campaigns to create a sustainable and greener future.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 shadow-sm border border-purple-100">
                    <BrainCircuit className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#172B6B] mb-1">Mental Well-being</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">Normalizing mental health conversations and providing psychological support initiatives for youth and local communities.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h4 className="font-bold text-[#172B6B] mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#3C9D23]" />
                  Our Commitment
                </h4>
                <ul className="space-y-3">
                  {[
                    "Secure processing and data protection",
                    "Transparent contribution records",
                    "Responsible use of funds",
                    "Verified payment acknowledgements"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-[#3C9D23] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
