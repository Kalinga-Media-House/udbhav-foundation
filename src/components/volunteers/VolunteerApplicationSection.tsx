/* eslint-disable */
"use client";

import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Check,
  X,
  Upload,
} from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";

import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";
import { STORAGE } from "@/constants";
import { INDIAN_STATES } from "@/constants/indian-states";
import { requestPublicVolunteerImageUpload } from "@/features/volunteers/public-actions";

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
  photo?: string;
  general?: string;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function VolunteerApplicationSection() {
  const [step, setStep] = useState(1);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [age, setAge] = useState("");
  
  const [occupation, setOccupation] = useState("");
  const [cityDistrict, setCityDistrict] = useState("");
  const [state, setState] = useState("");
  
  const [preferredAreas, setPreferredAreas] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  
  const [skills, setSkills] = useState("");
  const [motivation, setMotivation] = useState("");
  const [consent, setConsent] = useState(false);
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  
  useEffect(() => {
    if (photo) {
      const url = URL.createObjectURL(photo);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhotoPreview(null);
    }
  }, [photo]);

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

  const validateStep1 = (): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!occupation) {
      newErrors.occupation = "Please select your current occupation.";
    }

    if (!state.trim()) {
      newErrors.state = "Please select your state.";
    }

    if (!cityDistrict.trim()) {
      newErrors.cityDistrict = "Please enter your city or district.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};

    if (preferredAreas.length === 0) {
      newErrors.preferredAreas = "Please select at least one contribution area.";
    }

    if (availability.length === 0) {
      newErrors.availability = "Please select your availability.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: FormErrors = {};

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
  
  const validateStep5 = (): boolean => {
    const newErrors: FormErrors = {};
    if (photo) {
       if (photo.size > STORAGE.LIMITS.MAX_IMAGE_SIZE_MB * 1024 * 1024) {
           newErrors.photo = `File is too large. Max size is ${STORAGE.LIMITS.MAX_IMAGE_SIZE_MB}MB.`;
       }
       if (!STORAGE.ALLOWED_IMAGE_TYPES.includes(photo.type as any)) {
           newErrors.photo = "Please upload a JPG, PNG, or WebP image.";
       }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 4 && !validateStep4()) return;
    setStep(s => s + 1);
  };
  
  const handleBack = () => {
    setStep(s => s - 1);
  };

  const uploadPhotoToTemp = async (file: File): Promise<string> => {
    // 1. Get presigned URL
    const res = await requestPublicVolunteerImageUpload({
      filename: file.name,
      size: file.size,
      contentType: file.type,
    });
    
    if (!res.success || !res.data) {
      throw new Error(res.error || "Failed to initiate photo upload");
    }
    
    const { url, storageKey } = res.data;
    
    // 2. Upload via XHR
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error('Upload failed'));
      };
      xhr.onerror = () => reject(new Error('Upload network error'));
      xhr.send(file);
    });
    
    return storageKey;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSubmitted || isDuplicate) return;

    if (!validateStep5()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      let tempStorageKey: string | undefined = undefined;
      
      // Upload photo if present
      if (photo) {
         tempStorageKey = await uploadPhotoToTemp(photo);
      }

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
          availability: availability.join(", "),
          motivation: motivation.trim(),
          consent,
          tempStorageKey,
          originalFilename: photo?.name,
        }),
      });

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
    setPhoto(null);
    setErrors({});
    setStep(1);
  };

  const stepIndicators = [
    { num: 1, label: "Basic Information" },
    { num: 2, label: "Location & Occupation" },
    { num: 3, label: "Contribution" },
    { num: 4, label: "Additional Information" },
    { num: 5, label: "Photo & Submit" },
  ];

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
        <div className="max-w-[800px] mx-auto">
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
                      Under Review
                    </span>
                  </div>
                  <p
                    className="max-w-sm text-sm leading-relaxed"
                    style={{ color: "#5E6B63" }}
                  >
                    Our coordination team will review your application and reach out to you soon.
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
                  {/* Step Indicator */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-8 flex-wrap">
                    {stepIndicators.map((s, i) => (
                      <React.Fragment key={s.num}>
                        <div className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors ${step === s.num ? 'text-[#12245F]' : step > s.num ? 'text-[#439B25]' : 'text-gray-400'}`}>
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${step === s.num ? 'bg-[#12245F] text-white shadow-sm' : step > s.num ? 'bg-[#EEF8E9] text-[#439B25]' : 'bg-gray-100'}`}>
                            {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                          </div>
                          <span className={`${step === s.num || step > s.num ? 'inline' : 'hidden sm:inline'}`}>{s.label}</span>
                        </div>
                        {i < stepIndicators.length - 1 && <div className="w-2 sm:w-4 h-px bg-gray-200 shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>

                  {errors.general && (
                    <div
                      role="alert"
                      className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs sm:text-sm"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <span>{errors.general}</span>
                    </div>
                  )}

                  {/* ── STEP 1: Basic Information ── */}
                  {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <h3
                        className="font-heading text-lg sm:text-xl font-bold pb-2.5 mb-6 border-b border-soft-border/60"
                        style={{ color: "#12245F" }}
                      >
                        Basic Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
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
                          <div className="flex relative">
                            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-soft-border bg-gray-50 text-gray-500 text-sm">
                              +91
                            </span>
                            <input
                              id="mobileNumber"
                              type="tel"
                              required
                              value={mobileNumber}
                              onChange={(e) => {
                                setMobileNumber(e.target.value.replace(/\D/g, ""));
                                if (errors.mobileNumber)
                                  setErrors((p) => ({ ...p, mobileNumber: undefined }));
                              }}
                              placeholder="10-digit number"
                              maxLength={10}
                              aria-invalid={!!errors.mobileNumber}
                              className="w-full rounded-r-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                            />
                          </div>
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
                            Age <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            id="age"
                            type="number"
                            min="10"
                            max="100"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Your age"
                            className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8]"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-8 py-3 rounded-xl text-sm font-heading font-semibold text-pure-white transition-all hover:opacity-90 flex items-center gap-2"
                          style={{ background: "#439B25" }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 2: Location & Occupation ── */}
                  {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3
                        className="font-heading text-lg sm:text-xl font-bold pb-2.5 mb-6 border-b border-soft-border/60"
                        style={{ color: "#12245F" }}
                      >
                        Location & Occupation
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        {/* Occupation */}
                        <div>
                          <label
                            htmlFor="occupation"
                            className="block text-xs sm:text-sm font-semibold mb-1.5"
                            style={{ color: "#17231D" }}
                          >
                            Current Occupation *
                          </label>
                          <div className="relative">
                            <select
                              id="occupation"
                              value={occupation}
                              onChange={(e) => {
                                setOccupation(e.target.value);
                                if (errors.occupation) setErrors((p) => ({ ...p, occupation: undefined }));
                              }}
                              className="w-full rounded-xl px-4 py-3 pr-10 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] appearance-none bg-[#FDFCF8]"
                            >
                              <option value="" disabled>Select occupation</option>
                              {OCCUPATION_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {errors.occupation && (
                            <p className="text-red-600 text-xs mt-1">{errors.occupation}</p>
                          )}
                        </div>

                        {/* State */}
                        <SearchableCombobox
                          id="state"
                          label="State *"
                          value={state}
                          onChange={handleStateChange}
                          options={INDIAN_STATES}
                          placeholder="Search state..."
                          error={errors.state}
                        />

                        {/* City / District */}
                        <div>
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
                              if (errors.cityDistrict)
                                setErrors((p) => ({ ...p, cityDistrict: undefined }));
                            }}
                            placeholder={!state ? "Select state first" : "Enter your city or district"}
                            aria-invalid={!!errors.cityDistrict}
                            className={`w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all ${
                              !state
                                ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#FDFCF8] border-soft-border"
                            }`}
                          />
                          {errors.cityDistrict && (
                            <p className="text-red-600 text-xs mt-1">{errors.cityDistrict}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-6 py-3 rounded-xl text-sm font-heading font-semibold border border-gray-200 text-gray-600 transition-all hover:bg-gray-50"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-8 py-3 rounded-xl text-sm font-heading font-semibold text-pure-white transition-all hover:opacity-90"
                          style={{ background: "#439B25" }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 3: Contribution ── */}
                  {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3
                        className="font-heading text-lg sm:text-xl font-bold pb-2.5 mb-6 border-b border-soft-border/60"
                        style={{ color: "#12245F" }}
                      >
                        Contribution
                      </h3>

                      <div className="space-y-6">
                        {/* Preferred Areas */}
                        <MultiSelectDropdown
                          id="preferredAreas"
                          label="Contribution Preferences *"
                          helperText="Select the areas where you would like to contribute."
                          options={VOLUNTEER_AREAS}
                          selected={preferredAreas}
                          onChange={(val) => {
                            setPreferredAreas(val);
                            if (errors.preferredAreas)
                              setErrors((p) => ({ ...p, preferredAreas: undefined }));
                          }}
                          placeholder="Select areas of interest..."
                          error={errors.preferredAreas}
                        />

                        {/* Availability */}
                        <MultiSelectDropdown
                          id="availability"
                          label="Availability *"
                          helperText="When are you generally available to volunteer?"
                          options={AVAILABILITY_OPTIONS}
                          selected={availability}
                          onChange={(val) => {
                            setAvailability(val);
                            if (errors.availability)
                              setErrors((p) => ({ ...p, availability: undefined }));
                          }}
                          placeholder="Select availability..."
                          error={errors.availability}
                        />
                      </div>
                      
                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-6 py-3 rounded-xl text-sm font-heading font-semibold border border-gray-200 text-gray-600 transition-all hover:bg-gray-50"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-8 py-3 rounded-xl text-sm font-heading font-semibold text-pure-white transition-all hover:opacity-90"
                          style={{ background: "#439B25" }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 4: Additional Information ── */}
                  {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3
                        className="font-heading text-lg sm:text-xl font-bold pb-2.5 mb-6 border-b border-soft-border/60"
                        style={{ color: "#12245F" }}
                      >
                        Additional Information
                      </h3>

                      <div className="space-y-6">
                        {/* Skills (Optional) */}
                        <div>
                          <label
                            htmlFor="skills"
                            className="block text-xs sm:text-sm font-semibold mb-1.5"
                            style={{ color: "#17231D" }}
                          >
                            Skills You Can Contribute <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <textarea
                            id="skills"
                            rows={3}
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            placeholder="Tell us about your skills, experience, interests, or ideas."
                            className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8] resize-none"
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
                              if (errors.motivation)
                                setErrors((p) => ({ ...p, motivation: undefined }));
                            }}
                            placeholder="Share your motivation for joining our foundation (at least 15 characters)."
                            aria-invalid={!!errors.motivation}
                            className="w-full rounded-xl px-4 py-3 text-sm border border-soft-border focus:outline-none focus:ring-2 focus:ring-[#202B78] transition-all bg-[#FDFCF8] resize-none"
                          />
                          {errors.motivation && (
                            <p className="text-red-600 text-xs mt-1">{errors.motivation}</p>
                          )}
                        </div>
                        
                        <div className="pt-4 border-t border-soft-border/40">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-start mt-0.5">
                              <input
                                type="checkbox"
                                checked={consent}
                                onChange={(e) => {
                                  setConsent(e.target.checked);
                                  if (errors.consent) setErrors((p) => ({ ...p, consent: undefined }));
                                }}
                                className="peer sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${
                                  consent
                                    ? "bg-[#439B25] border-[#439B25]"
                                    : "bg-white border-gray-300 group-hover:border-[#439B25]/50"
                                } ${errors.consent ? "border-red-400 bg-red-50" : ""}`}
                              >
                                {consent && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </div>
                            <span className="text-sm leading-relaxed" style={{ color: "#5E6B63" }}>
                              I confirm that the information provided is accurate and agree to follow UDBHAV Foundation&apos;s volunteer guidelines and code of conduct. *
                            </span>
                          </label>
                          {errors.consent && (
                            <p className="text-red-600 text-xs mt-2 ml-8">{errors.consent}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-between">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="px-6 py-3 rounded-xl text-sm font-heading font-semibold border border-gray-200 text-gray-600 transition-all hover:bg-gray-50"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-8 py-3 rounded-xl text-sm font-heading font-semibold text-pure-white transition-all hover:opacity-90"
                          style={{ background: "#439B25" }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 5: Photo & Submit ── */}
                  {step === 5 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                      <h3
                        className="font-heading text-lg sm:text-xl font-bold pb-2.5 mb-6 border-b border-soft-border/60"
                        style={{ color: "#12245F" }}
                      >
                        Photo & Submit
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold mb-1.5" style={{ color: "#17231D" }}>
                            Upload Profile Photo <span className="text-gray-400 font-normal">(Optional)</span>
                          </label>
                          <p className="text-xs text-[#5E6B63] mb-4">
                            A clear profile photo helps us identify you. JPG, PNG or WebP only.
                          </p>
                          
                          <div className="flex flex-col items-center">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setPhoto(e.target.files[0]);
                                  setErrors((prev) => ({ ...prev, photo: undefined }));
                                }
                                // clear value so same file can be selected again
                                e.target.value = "";
                              }}
                            />
                            
                            {photoPreview ? (
                              <div className="relative group">
                                <img
                                  src={photoPreview}
                                  alt="Profile Preview"
                                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                                />
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-white text-xs font-semibold hover:underline"
                                  >
                                    Replace
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPhoto(null)}
                                    className="text-red-200 text-xs font-semibold hover:underline"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-32 h-32 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-[#12245F]/40 hover:bg-[#FDFCF8] transition-colors"
                              >
                                <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                <span className="text-xs font-medium">Upload Photo</span>
                              </button>
                            )}
                            {errors.photo && (
                              <p className="text-red-600 text-xs mt-3 text-center">{errors.photo}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between items-center pt-6 border-t border-soft-border/40">
                        <button
                          type="button"
                          onClick={handleBack}
                          disabled={isSubmitting}
                          className="px-6 py-3 rounded-xl text-sm font-heading font-semibold border border-gray-200 text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-8 py-3.5 rounded-xl text-sm font-heading font-semibold text-pure-white transition-all hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#439B25]/20"
                          style={{ background: "#439B25" }}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Volunteer Application"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </RevealCard>
        </div>
      </Container>
    </section>
  );
}
