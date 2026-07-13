"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if user has an active session from the recovery link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If no session, they might not have clicked a valid link, redirect to login
        router.push("/login");
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError(updateError.message || "Failed to update password. Please try again.");
      } else {
        setSuccess(true);
        // Ensure standard signout immediately so they must login with new password
        await supabase.auth.signOut();
        setTimeout(() => {
          router.push("/login?password=updated");
        }, 2000);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FCFCF8] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(23,43,107,0.08)] border border-[#172B6B]/10">
        
        <div className="flex justify-center mb-8 pb-8 border-b border-gray-100">
          <Image
            src="/udbhav-logo.svg" 
            alt="UDBHAV Foundation Logo" 
            width={140} 
            height={45} 
            priority
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-[#172B6B] mb-2">
            Create New Password
          </h1>
          <p className="text-sm text-gray-600">
            Please enter your new administrator password below.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
          
          <div aria-live="polite">
            {success && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F1F9ED] border border-[#3C9D23]/30 text-[#3C9D23] text-sm mb-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Password updated successfully. Redirecting to login...</p>
              </div>
            )}
            
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {!success && (
            <>
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-[#172B6B] uppercase mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[16px] transition-colors focus:ring-2 focus:ring-[#172B6B]/20 focus:border-[#172B6B] focus:outline-none"
                    placeholder="Enter new password"
                    aria-invalid={!!error}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[#172B6B] uppercase mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[16px] transition-colors focus:ring-2 focus:ring-[#172B6B]/20 focus:border-[#172B6B] focus:outline-none"
                    placeholder="Confirm new password"
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
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </main>
  );
}
