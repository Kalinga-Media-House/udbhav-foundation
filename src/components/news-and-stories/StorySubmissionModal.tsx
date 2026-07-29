"use client";

import { X, Send, CheckCircle2, Heart, Mic } from "lucide-react";
import React, { useState } from "react";

interface StorySubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "story" | "podcast";
}

export function StorySubmissionModal({
  isOpen,
  onClose,
  mode,
}: StorySubmissionModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [programmeConnected, setProgrammeConnected] = useState("Siksha Samman");
  const [storySummary, setStorySummary] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setStorySummary("");
    setConsentGiven(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-pure-white border border-[#12245F]/15 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close form"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FDFCF8] border border-[#12245F]/15 flex items-center justify-center text-[#12245F] hover:bg-[#EEF8E9] hover:border-[#439B25] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-[#439B25] mx-auto animate-bounce" />
            <h3 className="font-heading text-2xl font-bold text-[#12245F]">
              Thank You for Sharing!
            </h3>
            <p className="text-sm text-[#5E6B63] max-w-md mx-auto">
              {mode === "story"
                ? "Our editorial and community team has received your story submission. We review verified submissions carefully and will contact you."
                : "Thank you for suggesting an inspiring guest for the UDBHAV Podcast. Our podcast production team will review your recommendation."}
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="mt-4 px-6 py-2.5 rounded-xl font-heading text-sm font-semibold text-white bg-[#439B25] hover:bg-[#38841F] transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#439B25]">
              {mode === "story" ? (
                <>
                  <Heart className="w-4 h-4" />
                  <span>SHARE YOUR JOURNEY</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>SUGGEST A PODCAST GUEST</span>
                </>
              )}
            </div>

            <h3
              id="submission-modal-title"
              className="font-heading text-xl sm:text-2xl font-bold text-[#12245F] mb-1"
            >
              {mode === "story"
                ? "Share Your Impact Story"
                : "Suggest a Changemaker for UDBHAV Podcast"}
            </h3>

            <p className="text-xs sm:text-sm text-[#5E6B63] mb-5">
              {mode === "story"
                ? "Stories of perseverance and grassroots contribution inspire young scholars across Odisha."
                : "Know a student achiever, volunteer, or community leader whose journey can inspire others?"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#12245F] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCF8] border border-[#12245F]/15 text-sm text-[#17231D] focus:outline-none focus:border-[#439B25]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#12245F] mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCF8] border border-[#12245F]/15 text-sm text-[#17231D] focus:outline-none focus:border-[#439B25]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#12245F] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCF8] border border-[#12245F]/15 text-sm text-[#17231D] focus:outline-none focus:border-[#439B25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12245F] mb-1">
                  Connected UDBHAV Programme
                </label>
                <select
                  value={programmeConnected}
                  onChange={(e) => setProgrammeConnected(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCF8] border border-[#12245F]/15 text-sm text-[#12245F] focus:outline-none focus:border-[#439B25]"
                >
                  <option value="Siksha Samman">UDBHAV Siksha Samman</option>
                  <option value="Civil Services Coaching">
                    Free Civil Services Coaching
                  </option>
                  <option value="Plantation Drive">Plantation Drive</option>
                  <option value="Climate Action Run">Climate Action Run</option>
                  <option value="Books Distribution">
                    Books & Study Materials
                  </option>
                  <option value="Cyber Safety">Cyber Safety Awareness</option>
                  <option value="Mental Health">Mental Health Awareness</option>
                  <option value="Health Checkup">Health Check-up Camps</option>
                  <option value="Sanitation">
                    Sanitation & Dengue Awareness
                  </option>
                  <option value="Blood Donation">Blood Donation Camp</option>
                  <option value="Emergency Blood">
                    Emergency Blood Donation
                  </option>
                  <option value="Community Volunteer">
                    General Community Volunteering
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#12245F] mb-1">
                  {mode === "story"
                    ? "Brief Summary of Your Story / Journey"
                    : "Why should they be invited as a guest?"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={storySummary}
                  onChange={(e) => setStorySummary(e.target.value)}
                  placeholder={
                    mode === "story"
                      ? "Describe your achievement, challenge, or volunteering journey..."
                      : "Briefly share their achievement and social impact..."
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCF8] border border-[#12245F]/15 text-sm text-[#17231D] focus:outline-none focus:border-[#439B25]"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded border-[#12245F]/30 text-[#439B25] focus:ring-[#439B25]"
                />
                <label
                  htmlFor="consent"
                  className="text-xs text-[#5E6B63] leading-snug"
                >
                  I consent to sharing this information with UDBHAV
                  Foundation&rsquo;s editorial team for review and publication.
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl font-heading text-sm font-semibold text-white bg-[#439B25] hover:bg-[#38841F] transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit {mode === "story" ? "Story" : "Recommendation"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default StorySubmissionModal;
