"use client";

import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Check,
  Search,
  X,
} from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";
import { INDIAN_STATES } from "@/constants/indian-states";

// ─── Constants ───────────────────────────────────────────────────────────────

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

// ─── Shared Sub-Components ───────────────────────────────────────────────────

/**
 * Searchable Combobox for single-value selection (e.g. State).
 */
function SearchableCombobox({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
}: {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  options: readonly string[];
  placeholder: string;
  error?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : [...options];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        // Reset query to selected value when closing
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const el = listRef.current.children[highlightIdx] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIdx]);

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setQuery("");
      setOpen(false);
      setHighlightIdx(-1);
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIdx((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIdx((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIdx >= 0 && filtered[highlightIdx]) {
          handleSelect(filtered[highlightIdx]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setQuery("");
        setHighlightIdx(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="block text-xs sm:text-sm font-semibold mb-1.5"
        style={{ color: "#17231D" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          aria-invalid={!!error}
          disabled={disabled}
          value={open ? query : value}
          placeholder={disabled ? "Select state first" : placeholder}
          onFocus={() => {
            setOpen(true);
            setQuery("");
            setHighlightIdx(-1);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightIdx(-1);
            if (!open) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-xl px-4 py-3 pr-10 text-sm border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all ${
            disabled
              ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#FDFCF8] border-soft-border"
          } ${error ? "border-red-400" : ""}`}
        />
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform ${
            open ? "rotate-180" : ""
          } ${disabled ? "text-gray-300" : "text-[#7A8A82]"}`}
        />
      </div>

      {open && !disabled && (
        <ul
          ref={listRef}
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg py-1"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-2 text-sm text-gray-400">No results found</li>
          ) : (
            filtered.map((opt, idx) => (
              <li
                key={opt}
                role="option"
                aria-selected={value === opt}
                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2 ${
                  highlightIdx === idx
                    ? "bg-[#EEF8E9] text-[#439B25]"
                    : value === opt
                      ? "bg-[#F3F7F5] text-[#17231D] font-semibold"
                      : "text-[#17231D] hover:bg-[#F8FAF9]"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(opt);
                }}
                onMouseEnter={() => setHighlightIdx(idx)}
              >
                {value === opt && <Check className="w-3.5 h-3.5 text-[#439B25] shrink-0" />}
                <span className={value === opt ? "" : "pl-5.5"}>{opt}</span>
              </li>
            ))
          )}
        </ul>
      )}

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

/**
 * Multi-Select Dropdown for selecting multiple values.
 */
function MultiSelectDropdown({
  id,
  label,
  helperText,
  options,
  selected,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: React.ReactNode;
  helperText?: string;
  options: readonly string[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  };

  const removeItem = (opt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== opt));
  };

  // Build display summary
  const getSummary = () => {
    if (selected.length === 0) return null;
    if (selected.length <= 2) return selected.join(", ");
    return `${selected.slice(0, 2).join(", ")} +${selected.length - 2}`;
  };

  const summary = getSummary();

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="block text-xs sm:text-sm font-semibold mb-1"
        style={{ color: "#17231D" }}
      >
        {label}
      </label>
      {helperText && (
        <p className="text-xs text-[#5E6B63] mb-1.5">{helperText}</p>
      )}

      <button
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`w-full rounded-xl px-4 py-3 text-sm border bg-[#FDFCF8] text-left flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all ${
          error ? "border-red-400" : "border-soft-border"
        }`}
      >
        <span className={summary ? "text-[#17231D]" : "text-[#7A8A82]"}>
          {summary || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[#7A8A82] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Selected Tags (shown below the button when items are selected) */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEF8E9] text-[#2D7A16] text-xs font-medium border border-[#439B25]/20"
            >
              {item}
              <button
                type="button"
                onClick={(e) => removeItem(item, e)}
                className="hover:text-red-600 transition-colors"
                aria-label={`Remove ${item}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg py-1"
        >
          {options.map((opt) => {
            const isSelected = selected.includes(opt);
            return (
              <li
                key={opt}
                role="option"
                aria-selected={isSelected}
                className="px-4 py-2.5 text-sm cursor-pointer flex items-center gap-3 hover:bg-[#F8FAF9] transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggle(opt);
                }}
              >
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                    isSelected
                      ? "bg-[#439B25] border-[#439B25] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                </span>
                <span className={isSelected ? "text-[#17231D] font-medium" : "text-[#17231D]"}>
                  {opt}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="text-red-600 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

// ─── Form Types ──────────────────────────────────────────────────────────────

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

// ─── Main Component ──────────────────────────────────────────────────────────

export function VolunteerApplicationSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [cityDistrict, setCityDistrict] = useState("");
  const [state, setState] = useState("");
  const [preferredAreas, setPreferredAreas] = useState<string[]>([]);
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [motivation, setMotivation] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Reset city when state changes
  const handleStateChange = useCallback(
    (newState: string) => {
      if (newState !== state) {
        setCityDistrict("");
      }
      setState(newState);
      if (errors.state) {
        setErrors((prev) => ({ ...prev, state: undefined }));
      }
    },
    [state, errors.state]
  );

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

    if (!state.trim()) {
      newErrors.state = "Please select your state.";
    }

    if (!cityDistrict.trim()) {
      newErrors.cityDistrict = "Please enter your city or district.";
    }

    if (preferredAreas.length === 0) {
      newErrors.preferredAreas = "Please select at least one volunteer area.";
    }

    if (availability.length === 0) {
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
    if (isSubmitting || isSubmitted || isDuplicate) return;

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
          // Join availability array into comma-separated string for backend compatibility
          availability: availability.join(", "),
          motivation: motivation.trim(),
          consent,
        }),
      });

      // Handle duplicate application (409 Conflict)
      if (response.status === 409) {
        const data = await response.json().catch(() => ({}));
        setDuplicateMessage(data.message || "An application with this mobile number or email address has already been submitted.");
        setIsDuplicate(true);
        return;
      }

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

  const resetForm = () => {
    setIsSubmitted(false);
    setIsDuplicate(false);
    setDuplicateMessage("");
    setFullName("");
    setEmail("");
    setMobileNumber("");
    setAge("");
    setOccupation("");
    setCityDistrict("");
    setState("");
    setPreferredAreas([]);
    setSkills("");
    setAvailability([]);
    setMotivation("");
    setConsent(false);
    setErrors({});
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
            <div className="rounded-3xl p-6 sm:p-8 md:p-11 shadow-xl border border-[#12245F]/15 bg-pure-white">
              {isDuplicate ? (
                /* ── Duplicate Application State ── */
                <div className="flex flex-col items-center text-center py-10 sm:py-14 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EAF3FF] text-[#12245F] flex items-center justify-center border-2 border-[#12245F]/30">
                    <AlertCircle className="w-9 h-9" />
                  </div>
                  <h3
                    className="font-heading text-2xl sm:text-3xl font-bold"
                    style={{ color: "#12245F" }}
                  >
                    Application Already Exists
                  </h3>
                  <p
                    className="max-w-md text-sm sm:text-base leading-relaxed"
                    style={{ color: "#5E6B63" }}
                  >
                    {duplicateMessage}
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-4 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-semibold border border-[#12245F]/20 text-[#12245F] cursor-pointer hover:bg-[#EAF3FF] transition-colors"
                  >
                    Submit a Different Application
                  </button>
                </div>
              ) : isSubmitted ? (
                /* ── Success State ── */
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
                    Your volunteer application has been received successfully.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8E1] border border-[#E6A817]/30">
                    <span className="w-2 h-2 rounded-full bg-[#E6A817] animate-pulse" />
                    <span className="text-sm font-semibold" style={{ color: "#8B6914" }}>
                      Pending Review
                    </span>
                  </div>
                  <p
                    className="max-w-sm text-sm leading-relaxed"
                    style={{ color: "#5E6B63" }}
                  >
                    Our team will review your application and contact you.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-4 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-semibold text-pure-white cursor-pointer"
                    style={{ background: "#439B25" }}
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-8"
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

                  {/* ── SECTION 1: Personal Information ── */}
                  <div>
                    <h3
                      className="font-heading text-base sm:text-lg font-bold pb-2.5 mb-4 border-b border-soft-border/60"
                      style={{ color: "#12245F" }}
                    >
                      Personal Information
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
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }));
                          }}
                          placeholder="Enter your full name"
                          aria-invalid={!!errors.fullName}
                          className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                        />
                        {errors.fullName && (
                          <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                        )}
                      </div>

                      {/* Email */}
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
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                          }}
                          placeholder="your.email@example.com"
                          aria-invalid={!!errors.email}
                          className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                        />
                        {errors.email && (
                          <p className="text-red-600 text-xs mt-1">{errors.email}</p>
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
                          onChange={(e) => {
                            setMobileNumber(e.target.value);
                            if (errors.mobileNumber) setErrors((p) => ({ ...p, mobileNumber: undefined }));
                          }}
                          placeholder="10-digit Indian mobile number"
                          aria-invalid={!!errors.mobileNumber}
                          className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                        />
                        {errors.mobileNumber && (
                          <p className="text-red-600 text-xs mt-1">{errors.mobileNumber}</p>
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
                          <span className="font-normal text-xs text-[#5E6B63]">(Optional)</span>
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
                          onChange={(e) => {
                            setOccupation(e.target.value);
                            if (errors.occupation) setErrors((p) => ({ ...p, occupation: undefined }));
                          }}
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
                          <p className="text-red-600 text-xs mt-1">{errors.occupation}</p>
                        )}
                      </div>

                      {/* State (Searchable Combobox) */}
                      <SearchableCombobox
                        id="state"
                        label={<>State *</>}
                        value={state}
                        onChange={handleStateChange}
                        options={INDIAN_STATES}
                        placeholder="Search and select your state"
                        error={errors.state}
                      />

                      {/* City / District (dependent on State) */}
                      <div className="sm:col-span-2 sm:max-w-[calc(50%-0.625rem)]">
                        <label
                          htmlFor="cityDistrict"
                          className="block text-xs sm:text-sm font-semibold mb-1.5"
                          style={{ color: "#17231D" }}
                        >
                          City / District *
                        </label>
                        <input
                          id="cityDistrict"
                          type="text"
                          required
                          disabled={!state}
                          value={cityDistrict}
                          onChange={(e) => {
                            setCityDistrict(e.target.value);
                            if (errors.cityDistrict) setErrors((p) => ({ ...p, cityDistrict: undefined }));
                          }}
                          placeholder={state ? `Enter city or district in ${state}` : "Select state first"}
                          aria-invalid={!!errors.cityDistrict}
                          className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all ${
                            !state
                              ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#FDFCF8] border-soft-border"
                          } ${errors.cityDistrict ? "border-red-400" : ""}`}
                        />
                        {errors.cityDistrict && (
                          <p className="text-red-600 text-xs mt-1">{errors.cityDistrict}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── SECTION 2: Contribution Preferences ── */}
                  <div>
                    <h3
                      className="font-heading text-base sm:text-lg font-bold pb-2.5 mb-4 border-b border-soft-border/60"
                      style={{ color: "#12245F" }}
                    >
                      Contribution Preferences
                    </h3>

                    <MultiSelectDropdown
                      id="preferredAreas"
                      label={<>Contribution Preferences *</>}
                      helperText="Select the areas where you would like to contribute."
                      options={VOLUNTEER_AREAS}
                      selected={preferredAreas}
                      onChange={(val) => {
                        setPreferredAreas(val);
                        if (errors.preferredAreas) setErrors((p) => ({ ...p, preferredAreas: undefined }));
                      }}
                      placeholder="Select contribution areas"
                      error={errors.preferredAreas}
                    />
                  </div>

                  {/* ── SECTION 3: Availability ── */}
                  <div>
                    <h3
                      className="font-heading text-base sm:text-lg font-bold pb-2.5 mb-4 border-b border-soft-border/60"
                      style={{ color: "#12245F" }}
                    >
                      Availability
                    </h3>

                    <MultiSelectDropdown
                      id="availability"
                      label={<>Availability *</>}
                      options={AVAILABILITY_OPTIONS}
                      selected={availability}
                      onChange={(val) => {
                        setAvailability(val);
                        if (errors.availability) setErrors((p) => ({ ...p, availability: undefined }));
                      }}
                      placeholder="Select your availability"
                      error={errors.availability}
                    />
                  </div>

                  {/* ── SECTION 4: Additional Information ── */}
                  <div>
                    <h3
                      className="font-heading text-base sm:text-lg font-bold pb-2.5 mb-4 border-b border-soft-border/60"
                      style={{ color: "#12245F" }}
                    >
                      Additional Information
                    </h3>

                    <div className="space-y-5">
                      {/* Skills */}
                      <div>
                        <label
                          htmlFor="skills"
                          className="block text-xs sm:text-sm font-semibold mb-1.5"
                          style={{ color: "#17231D" }}
                        >
                          Skills You Can Contribute{" "}
                          <span className="font-normal text-xs text-[#5E6B63]">(Optional)</span>
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

                      {/* Motivation */}
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
                          onChange={(e) => {
                            setMotivation(e.target.value);
                            if (errors.motivation) setErrors((p) => ({ ...p, motivation: undefined }));
                          }}
                          placeholder="Share your motivation for volunteering with our community..."
                          aria-invalid={!!errors.motivation}
                          className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8] resize-y"
                        />
                        {errors.motivation && (
                          <p className="text-red-600 text-xs mt-1">{errors.motivation}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Agreement ── */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (errors.consent) setErrors((p) => ({ ...p, consent: undefined }));
                        }}
                        className="mt-1 w-4 h-4 rounded accent-[#439B25] cursor-pointer"
                      />
                      <span
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: "#17231D" }}
                      >
                        I confirm that the information provided is accurate and
                        agree to follow UDBHAV Foundation&apos;s volunteer guidelines
                        and code of conduct. *
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-red-600 text-xs mt-1">{errors.consent}</p>
                    )}
                  </div>

                  {/* ── Submit Button ── */}
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
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Volunteer Application</span>
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
