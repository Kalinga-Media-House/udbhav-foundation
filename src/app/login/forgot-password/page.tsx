"use client";

import { Mail, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { BrandLogo } from "@/components/shared/BrandLogo";
import { clientLogger } from "@/lib/logger/client-logger";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");

    if (!email) {
      setError("Email address is required.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login/update-password`,
      });

      if (resetError) {
        // Do not leak existence. Log generic error or proceed if rate limited.
        clientLogger.error("Password reset error", resetError);
      }

      // Generic success message to prevent account enumeration
      setStatusMessage(
        "If an eligible administrator account is associated with this email address, password reset instructions have been sent."
      );
    } catch {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FCFCF8] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(23,43,107,0.08)] border border-[#172B6B]/10">
        
        <div className="flex justify-center mb-8 pb-8 border-b border-gray-100">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 shadow-sm border border-gray-100 w-fit">
            <BrandLogo />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-[#172B6B] mb-2">
            Reset Admin Password
          </h1>
          <p className="text-sm text-gray-600">
            Enter your authorized admin email address. If the account is eligible, password reset instructions will be sent to the registered email.
          </p>
        </div>

        <form onSubmit={handleResetRequest} className="flex flex-col gap-5">
          
          <div aria-live="polite">
            {statusMessage && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F1F9ED] border border-[#3C9D23]/30 text-[#3C9D23] text-sm mb-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{statusMessage}</p>
              </div>
            )}
            
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {!statusMessage && (
            <>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#172B6B] uppercase mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[16px] transition-colors focus:ring-2 focus:ring-[#172B6B]/20 focus:border-[#172B6B] focus:outline-none"
                    placeholder="admin@udbhavfoundation.in"
                    aria-invalid={!!error}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#172B6B] to-[#203a95] px-4 py-3.5 text-sm sm:text-base font-heading font-semibold text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#172B6B] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </button>
            </>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#172B6B] hover:text-[#3C9D23] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Admin Login
          </Link>
        </div>
      </div>
    </main>
  );
}
