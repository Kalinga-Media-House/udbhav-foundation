import { ShieldCheck, Calendar, Users, Activity } from "lucide-react";
import type { Metadata } from "next";
import React, { Suspense } from "react";

import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { BrandLogo } from "@/components/shared/BrandLogo";

export const metadata: Metadata = {
  title: "Admin Portal Sign In | UDBHAV FOUNDATION",
  description: "Secure login portal for authorized UDBHAV Foundation administrators.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FCFCF8] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1100px] bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(23,43,107,0.08)] flex flex-col md:flex-row border border-[#172B6B]/10">
        
        {/* Left Side: Foundation Identity Panel (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#172B6B] via-[#101F55] to-[#12245F] p-10 lg:p-14 flex-col justify-between relative overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#3C9D23]/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#EAF3FF]/5 blur-2xl" />
          
          <div className="relative z-10">
            {/* White rounded container for the brand logo */}
            <div className="bg-white/95 backdrop-blur-sm rounded-[14px] p-3 sm:p-4 w-fit mb-10 shadow-sm border border-white/40">
              <BrandLogo />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] sm:text-xs font-heading font-bold tracking-wider uppercase mb-5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SECURE ADMIN PORTAL</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight mb-4">
              Manage Impact.<br />
              <span className="text-[#3C9D23]">Empower Change.</span>
            </h1>

            <p className="text-sm lg:text-base text-white/80 leading-relaxed max-w-sm mb-10">
              A secure workspace for authorized UDBHAV Foundation administrators to manage programmes, events, stories, galleries, volunteers, donations, and community impact.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-[#3C9D23]" />
                </div>
                <span className="text-sm font-medium">Programme Management</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#3C9D23]" />
                </div>
                <span className="text-sm font-medium">Event & Gallery Updates</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#3C9D23]" />
                </div>
                <span className="text-sm font-medium">Impact Monitoring</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-6 border-t border-white/10">
            <p className="text-xs text-white/60">
              Protected access for authorized UDBHAV Foundation administrators only.
            </p>
          </div>
        </div>

        {/* Right Side: Admin Sign-in Form (Full width on mobile) */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 sm:p-10 lg:p-14">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden flex flex-col items-center text-center mb-8 pb-8 border-b border-gray-100">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 mb-4 shadow-sm border border-gray-100 w-fit mx-auto">
              <BrandLogo />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#172B6B] text-white text-[10px] font-heading font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3 h-3" />
              <span>UDBHAV ADMIN PORTAL</span>
            </div>
          </div>

          <div className="mb-8 text-center md:text-left">
            <p className="text-[#3C9D23] text-xs font-bold uppercase tracking-wider mb-2">
              WELCOME BACK
            </p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#172B6B] mb-2">
              Admin Sign In
            </h2>
            <p className="text-sm text-gray-500">
              Enter your authorized administrator credentials to continue.
            </p>
          </div>

          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading form...</div>}>
            <AdminLoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
