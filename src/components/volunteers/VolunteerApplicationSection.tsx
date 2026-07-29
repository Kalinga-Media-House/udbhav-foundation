"use client";

import {
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";
import React, { useState, useEffect } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

const OCCUPATION_OPTIONS = [
  "School Student",
  "College/University Student",
  "Teacher/Educator",
  "Working Professional",
  "Entrepreneur",
  "Social Worker",
  "Retired Professional",
  "Other",
];

const VOLUNTEER_AREAS = [
  "Education & Mentorship",
  "Environmental Action",
  "Health & Well-being",
  "Events & Campaigns",
  "Research & Community Surveys",
  "Media & Communication",
  "Technology & Digital Support",
  "Emergency & Community Support",
  "Other",
];

const AVAILABILITY_OPTIONS = [
  "Weekdays",
  "Weekends",
  "Flexible",
  "Event Based",
  "Online / Remote",
  "Regular Field Volunteering",
];

interface FormErrors {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  occupation?: string;
  cityDistrict?: string;
  state?: string;
  preferredAreas?: string;
  availability?: string;
  motivation?: string;
  consent?: string;
  general?: string;
}

export function VolunteerApplicationSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [cityDistrict, setCityDistrict] = useState("");
  const [state, setState] = useState("Odisha");
  const [preferredAreas, setPreferredAreas] = useState<string[]>([]);
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
  const [motivation, setMotivation] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Listen for 'select-volunteer-area' custom event dispatched by opportunity cards
  useEffect(() => {
    const handleSelectArea = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const selectedArea = customEvent.detail;
      if (selectedArea && VOLUNTEER_AREAS.includes(selectedArea)) {
        setPreferredAreas((prev) =>
          prev.includes(selectedArea) ? prev : [...prev, selectedArea]
        );
      }
    };

    window.addEventListener("select-volunteer-area", handleSelectArea);
    return () =>
      window.removeEventListener("select-volunteer-area", handleSelectArea);
  }, []);

  const togglePreferredArea = (area: string) => {
    setPreferredAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
    if (errors.preferredAreas) {
      setErrors((prev) => ({ ...prev, preferredAreas: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    const cleanMobile = mobileNumber.replace(/\D/g, "");
    if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]/.test(cleanMobile)) {
      newErrors.mobileNumber =
        "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!occupation) {
      newErrors.occupation = "Please select your current occupation.";
    }

    if (!cityDistrict.trim()) {
      newErrors.cityDistrict = "Please enter your city or district.";
    }

    if (!state.trim()) {
      newErrors.state = "Please enter your state.";
    }

    if (preferredAreas.length === 0) {
      newErrors.preferredAreas = "Please select at least one volunteer area.";
    }

    if (!availability) {
      newErrors.availability = "Please select your availability.";
    }

    if (!motivation.trim() || motivation.trim().length < 15) {
      newErrors.motivation =
        "Please tell us briefly why you want to join UDBHAV (at least 15 characters).";
    }

    if (!consent) {
      newErrors.consent =
        "You must confirm accuracy and agree to follow volunteer guidelines.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSubmitted) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/volunteer-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          mobileNumber: mobileNumber.replace(/\D/g, ""),
          age: age ? parseInt(age, 10) : null,
          occupation,
          cityDistrict: cityDistrict.trim(),
          state: state.trim(),
          preferredAreas,
          skills: skills.trim(),
          availability,
          motivation: motivation.trim(),
          consent,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not submit application. Please check your connection and try again.";
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="volunteer-application"
      aria-labelledby="application-heading"
      className="relative w-full py-14 sm:py-18 md:py-24 border-b border-soft-border/40 scroll-mt-16"
      style={{
        background:
          "linear-gradient(135deg, #EAF3FF 0%, #FDFCF8 50%, #EEF8E9 100%)",
      }}
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <RevealCard as="div" index={0}>
            <span
              className="eyebrow-label font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2"
              style={{ color: "#439B25" }}
            >
              JOIN THE MOVEMENT
            </span>
            <h2
              id="application-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3"
              style={{ color: "#12245F" }}
            >
              Become an UDBHAV Volunteer
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: "#5E6B63" }}
            >
              Tell us a little about yourself and how you would like to contribute.
            </p>
          </RevealCard>
        </div>

        {/* Form Card */}
        <div className="max-w-4xl mx-auto">
          <RevealCard as="div" index={1}>
            <div
              className="rounded-3xl p-6 sm:p-8 md:p-11 shadow-xl border border-[#12245F]/15 bg-pure-white"
            >
              {isSubmitted ? (
                /* Success Message State */
                <div className="flex flex-col items-center text-center py-10 sm:py-14 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EEF8E9] text-[#439B25] flex items-center justify-center border-2 border-[#439B25]">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3
                    className="font-heading text-2xl sm:text-3xl font-bold"
                    style={{ color: "#12245F" }}
                  >
                    Thank You for Joining Our Movement!
                  </h3>
                  <p
                    className="max-w-md text-sm sm:text-base leading-relaxed"
                    style={{ color: "#5E6B63" }}
                  >
                    Your volunteer application has been received successfully. Our
                    coordination team will review your application and reach out to
                    you soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName("");
                      setEmail("");
                      setMobileNumber("");
                      setAge("");
                      setOccupation("");
                      setCityDistrict("");
                      setState("Odisha");
                      setPreferredAreas([]);
                      setSkills("");
                      setAvailability("");
                      setMotivation("");
                      setConsent(false);
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-semibold text-pure-white cursor-pointer"
                    style={{ background: "#439B25" }}
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6 sm:space-y-8"
                >
                  {errors.general && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs sm:text-sm"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <span>{errors.general}</span>
                    </div>
                  )}

                  {/* SECTION 1: Personal Details */}
                  <div>
                    <h3
                      className="font-heading text-base sm:text-lg font-bold pb-2.5 mb-4 border-b border-soft-border/60"
                      style={{ color: "#12245F" }}
                    >
                      1. Personal Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {/* Full Name */}
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-xs sm:text-sm font-semibold mb-1.5"
                          style={{ color: "#17231D" }}
                        >
                          Full Name *
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          aria-invalid={!!errors.fullName}
                          className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                        />
                        {errors.fullName && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs sm:text-sm font-semibold mb-1.5"
                          style={{ color: "#17231D" }}
                        >
                          Email Address *
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          aria-invalid={!!errors.email}
                          className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                        />
                        {errors.email && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label
                          htmlFor="mobileNumber"
                          className="block text-xs sm:text-sm font-semibold mb-1.5"
                          style={{ color: "#17231D" }}
                        >
                          Mobile Number *
                        </label>
                        <input
                          id="mobileNumber"
                          type="tel"
                          required
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="10-digit Indian mobile number"
                          aria-invalid={!!errors.mobileNumber}
                          className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                        />
                        {errors.mobileNumber && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors.mobileNumber}
                          </p>
                        )}
                      </div>

                      {/* Age */}
                      <div>
                        <label
                          htmlFor="age"
                          className="block text-xs sm:text-sm font-semibold mb-1.5"
                          style={{ color: "#17231D" }}
                        >
                          Age{" "}
                          <span className="font-normal text-xs text-[#5E6B63]">
                            (Optional)
                          </span>
                        </label>
                        <input
                          id="age"
                          type="number"
                          min="16"
                          max="99"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="e.g. 24"
                          className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                        />
                      </div>

                      {/* Occupation */}
                      <div>
                        <label
                          htmlFor="occupation"
                          className="block text-xs sm:text-sm font-semibold mb-1.5"
                          style={{ color: "#17231D" }}
                        >
                          Current Occupation *
                        </label>
                        <select
                          id="occupation"
                          required
                          value={occupation}
                          onChange={(e) => setOccupation(e.target.value)}
                          aria-invalid={!!errors.occupation}
                          className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                        >
                          <option value="">Select your occupation</option>
                          {OCCUPATION_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {errors.occupation && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors.occupation}
                          </p>
                        )}
                      </div>

                      {/* City / District */}
                      <div>
                        <label
                          htmlFor="cityDistrict"
                          className="block text-xs sm:text-sm font-semibold mb-1.5"
                          style={{ color: "#17231D" }}
                        >
                          Current City / District *
                        </label>
                        <input
                          id="cityDistrict"
                          type="text"
                          required
                          value={cityDistrict}
                          onChange={(e) => setCityDistrict(e.target.value)}
                          placeholder="e.g. Bhubaneswar / Khordha"
                          aria-invalid={!!errors.cityDistrict}
                          className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                        />
                        {errors.cityDistrict && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors.cityDistrict}
                          </p>
                        )}
                      </div>

                      {/* State */}
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="state"
                          className="block text-xs sm:text-sm font-semibold mb-1.5"
                          style={{ color: "#17231D" }}
                        >
                          State *
                        </label>
                        <input
                          id="state"
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="State"
                          aria-invalid={!!errors.state}
                          className="w-full sm:w-1/2 rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                        />
                        {errors.state && (
                          <p className="text-red-600 text-xs mt-1">
                            {errors.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Volunteering Preferences */}
                  <div>
                    <h3
                      className="font-heading text-base sm:text-lg font-bold pb-2.5 mb-4 border-b border-soft-border/60"
                      style={{ color: "#12245F" }}
                    >
                      2. Contribution Preferences
                    </h3>

                    {/* Preferred Volunteer Areas */}
                    <div className="mb-6">
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: "#17231D" }}>
                        Preferred Volunteer Area *{" "}
                        <span className="font-normal text-xs text-[#5E6B63]">
                          (Select one or more)
                        </span>
                      </label>

                      <div className="flex flex-wrap gap-2 sm:gap-2.5">
                        {VOLUNTEER_AREAS.map((area) => {
                          const selected = preferredAreas.includes(area);
                          return (
                            <button
                              key={area}
                              type="button"
                              onClick={() => togglePreferredArea(area)}
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                                selected
                                  ? "bg-[#EEF8E9] border-[#439B25] text-[#439B25] shadow-sm font-semibold"
                                  : "bg-[#FDFCF8] border-soft-border text-[#17231D] hover:border-[#12245F]/30"
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                                  selected
                                    ? "bg-[#439B25] border-[#439B25] text-pure-white"
                                    : "border-soft-border"
                                }`}
                              >
                                {selected && <Check className="w-3 h-3 stroke-[2.5]" />}
                              </span>
                              {area}
                            </button>
                          );
                        })}
                      </div>
                      {errors.preferredAreas && (
                        <p className="text-red-600 text-xs mt-1.5">
                          {errors.preferredAreas}
                        </p>
                      )}
                    </div>

                    {/* Availability */}
                    <div className="mb-6">
                      <label className="block text-xs sm:text-sm font-semibold mb-2" style={{ color: "#17231D" }}>
                        Availability *
                      </label>
                      <div className="flex flex-wrap gap-2 sm:gap-2.5">
                        {AVAILABILITY_OPTIONS.map((opt) => {
                          const selected = availability === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setAvailability(opt);
                                if (errors.availability) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    availability: undefined,
                                  }));
                                }
                              }}
                              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                                selected
                                  ? "bg-[#EAF3FF] border-[#202B78] text-[#202B78] shadow-sm font-semibold"
                                  : "bg-[#FDFCF8] border-soft-border text-[#17231D] hover:border-[#12245F]/30"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {errors.availability && (
                        <p className="text-red-600 text-xs mt-1.5">
                          {errors.availability}
                        </p>
                      )}
                    </div>

                    {/* Skills You Can Contribute */}
                    <div className="mb-6">
                      <label
                        htmlFor="skills"
                        className="block text-xs sm:text-sm font-semibold mb-1.5"
                        style={{ color: "#17231D" }}
                      >
                        Skills You Can Contribute{" "}
                        <span className="font-normal text-xs text-[#5E6B63]">
                          (Optional)
                        </span>
                      </label>
                      <textarea
                        id="skills"
                        rows={3}
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="Tell us about your skills, experience, interests, or ideas."
                        className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8] resize-y"
                      />
                    </div>

                    {/* Why Do You Want to Join UDBHAV? */}
                    <div>
                      <label
                        htmlFor="motivation"
                        className="block text-xs sm:text-sm font-semibold mb-1.5"
                        style={{ color: "#17231D" }}
                      >
                        Why Do You Want to Join UDBHAV? *
                      </label>
                      <textarea
                        id="motivation"
                        rows={4}
                        required
                        value={motivation}
                        onChange={(e) => setMotivation(e.target.value)}
                        placeholder="Share your motivation for volunteering with our community..."
                        aria-invalid={!!errors.motivation}
                        className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8] resize-y"
                      />
                      {errors.motivation && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.motivation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (errors.consent) {
                            setErrors((prev) => ({
                              ...prev,
                              consent: undefined,
                            }));
                          }
                        }}
                        className="mt-1 w-4 h-4 rounded accent-[#439B25] cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm leading-relaxed" style={{ color: "#17231D" }}>
                        I confirm that the information provided is accurate and
                        agree to follow UDBHAV Foundation’s volunteer guidelines
                        and code of conduct. *
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-heading font-semibold text-sm sm:text-base text-pure-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
                      style={{ background: "#439B25" }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <HeartHandshake className="w-5 h-5" />
                          <span>Submit Volunteer Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </RevealCard>
        </div>
      </Container>
    </section>
  );
}

export default VolunteerApplicationSection;
