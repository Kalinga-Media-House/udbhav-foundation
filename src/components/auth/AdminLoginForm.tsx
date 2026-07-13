"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const initialAuthError = searchParams.get("error") === "unauthorized" 
    ? "This account is not authorized to access the UDBHAV Foundation Admin Portal." 
    : "";
  const [authError, setAuthError] = useState(initialAuthError);
  
  const initialSuccessMsg = searchParams.get("password") === "updated"
    ? "Your password has been successfully updated. Please sign in with your new password."
    : "";
  const [successMessage] = useState(initialSuccessMsg);

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setAuthError("");

    if (!email) {
      setEmailError("Email address is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must contain at least 8 characters.");
      isValid = false;
    }

    return isValid;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setAuthError("");

    try {
      // For session-only persistence, you would configure Supabase client,
      // but Supabase auth handles session persistence internally via local storage by default.
      // If we need session-only, we would need a custom storage adapter, which can break SSR.
      // As instructed: "Retain Supabase’s secure standard session handling rather than creating an unsafe custom authentication mechanism if session-only breaks SSR."
      // We will proceed with the standard signInWithPassword.

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Generic error message to avoid exposing internal errors
        setAuthError("The email address or password is incorrect. Please try again.");
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Check role locally first to fail fast, server layout will do the authoritative check
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role, is_active")
          .eq("user_id", data.user.id)
          .single();

        const validRoles = ["super_admin", "admin", "content_admin", "programme_admin"];

        if (roleError || !roleData || !roleData.is_active || !validRoles.includes(roleData.role)) {
          await supabase.auth.signOut();
          setAuthError("This account is not authorized to access the UDBHAV Foundation Admin Portal.");
          setIsLoading(false);
          return;
        }

        // Handle redirect logic securely
        const redirectParam = searchParams.get("redirect");
        let redirectUrl = "/admin/dashboard";

        if (redirectParam) {
          const isValidInternalRedirect = redirectParam.startsWith("/") && !redirectParam.startsWith("//");
          if (isValidInternalRedirect) {
            redirectUrl = redirectParam;
          }
        }

        router.push(redirectUrl);
        router.refresh(); // Ensure the layout runs server checks
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="flex flex-col gap-5 w-full max-w-md mx-auto md:mx-0">
      
      {/* Global Auth Status */}
      <div aria-live="polite">
        {authError && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{authError}</p>
          </div>
        )}
        
        {successMessage && !authError && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F1F9ED] border border-[#3C9D23]/30 text-[#3C9D23] text-sm mb-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{successMessage}</p>
          </div>
        )}
      </div>

      {/* Email Input */}
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
            className={`block w-full pl-11 pr-4 py-3 rounded-xl border text-[16px] transition-colors focus:ring-2 focus:outline-none ${
              emailError 
                ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500" 
                : "border-gray-200 bg-gray-50 focus:ring-[#172B6B]/20 focus:border-[#172B6B]"
            }`}
            placeholder="admin@udbhavfoundation.in"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
        </div>
        {emailError && (
          <p id="email-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {emailError}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-[#172B6B] uppercase mb-1.5">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`block w-full pl-11 pr-12 py-3 rounded-xl border text-[16px] transition-colors focus:ring-2 focus:outline-none ${
              passwordError 
                ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500" 
                : "border-gray-200 bg-gray-50 focus:ring-[#172B6B]/20 focus:border-[#172B6B]"
            }`}
            placeholder="Enter your password"
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#172B6B] focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        {passwordError && (
          <p id="password-error" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {passwordError}
          </p>
        )}
      </div>

      {/* Options Row */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-gray-300 text-[#172B6B] focus:ring-[#172B6B]"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 select-none">
            Remember me
          </label>
        </div>
        
        <Link 
          href="/login/forgot-password"
          className="text-sm font-semibold text-[#3C9D23] hover:text-[#2d761a]"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#172B6B] to-[#203a95] px-4 py-3.5 text-sm sm:text-base font-heading font-semibold text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#172B6B] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all overflow-hidden mt-2"
      >
        {/* Shine effect overlay */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
        
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            Sign In to Admin Portal
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

    </form>
  );
}
