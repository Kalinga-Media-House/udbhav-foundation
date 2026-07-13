"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Sprout,
  Footprints,
  Library,
  ShieldCheck,
  HeartHandshake,
  Stethoscope,
  Sparkles,
  HeartPulse,
  Siren,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { RevealCard } from "@/components/shared/RevealCard";

export interface InitiativeItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  icon: React.ComponentType<{ className?: string }>;
  goalAmount: number;
  raisedAmount: number;
  availableAmount: number;
  percentage: number;
  formattedGoal: string;
  formattedRaised: string;
  formattedAvailable: string;
  theme: {
    gradient: string;
    badgeBg: string;
    badgeText: string;
    progressFill: string;
    buttonBg: string;
    buttonHover: string;
  };
  donationUrl: string;
  detailsUrl: string;
}

export const SUPPORT_INITIATIVES_DATA: InitiativeItem[] = [
  {
    id: "init-01",
    slug: "udbhav-siksha-samman",
    number: "01",
    title: "UDBHAV SIKSHA SAMMAN",
    category: "Education & Recognition",
    description:
      "“Support deserving students through educational recognition, encouragement, and opportunities that inspire them to continue learning and achieving.”",
    image: "/hero/hero-02.png",
    icon: GraduationCap,
    goalAmount: 200000,
    raisedAmount: 128000,
    availableAmount: 72000,
    percentage: 64,
    formattedGoal: "₹2,00,000",
    formattedRaised: "₹1,28,000",
    formattedAvailable: "₹72,000",
    theme: {
      gradient: "from-indigo-700 to-blue-700",
      badgeBg: "bg-indigo-50",
      badgeText: "text-indigo-700",
      progressFill: "bg-indigo-600",
      buttonBg: "bg-indigo-600",
      buttonHover: "hover:bg-indigo-700",
    },
    donationUrl: "/donate?campaign=udbhav-siksha-samman",
    detailsUrl: "/about",
  },
  {
    id: "init-02",
    slug: "free-civil-services-coaching-program",
    number: "02",
    title: "FREE CIVIL SERVICES COACHING PROGRAM",
    category: "Public Service Education",
    description:
      "“Help aspiring civil-service candidates access quality guidance, learning resources, mentorship, and preparation opportunities regardless of their financial background.”",
    image: "/hero/hero-05.png",
    icon: BookOpen,
    goalAmount: 500000,
    raisedAmount: 285000,
    availableAmount: 215000,
    percentage: 57,
    formattedGoal: "₹5,00,000",
    formattedRaised: "₹2,85,000",
    formattedAvailable: "₹2,15,000",
    theme: {
      gradient: "from-blue-700 to-violet-700",
      badgeBg: "bg-blue-50",
      badgeText: "text-blue-700",
      progressFill: "bg-blue-600",
      buttonBg: "bg-blue-600",
      buttonHover: "hover:bg-blue-700",
    },
    donationUrl: "/donate?campaign=free-civil-services-coaching-program",
    detailsUrl: "/about",
  },
  {
    id: "init-03",
    slug: "plantation-drive",
    number: "03",
    title: "PLANTATION DRIVE",
    category: "Environment & Sustainability",
    description:
      "“Support community plantation activities that restore green spaces, encourage environmental responsibility, and create a healthier future.”",
    image: "/hero/hero-04.png",
    icon: Sprout,
    goalAmount: 150000,
    raisedAmount: 108000,
    availableAmount: 42000,
    percentage: 72,
    formattedGoal: "₹1,50,000",
    formattedRaised: "₹1,08,000",
    formattedAvailable: "₹42,000",
    theme: {
      gradient: "from-emerald-700 to-green-600",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      progressFill: "bg-emerald-600",
      buttonBg: "bg-emerald-600",
      buttonHover: "hover:bg-emerald-700",
    },
    donationUrl: "/donate?campaign=plantation-drive",
    detailsUrl: "/about",
  },
  {
    id: "init-04",
    slug: "climate-action-run",
    number: "04",
    title: "CLIMATE ACTION RUN",
    category: "Climate Awareness",
    description:
      "“Support awareness, participation, and collective action for climate responsibility through inclusive community campaigns and public engagement.”",
    image: "/hero/hero-09.png",
    icon: Footprints,
    goalAmount: 200000,
    raisedAmount: 122000,
    availableAmount: 78000,
    percentage: 61,
    formattedGoal: "₹2,00,000",
    formattedRaised: "₹1,22,000",
    formattedAvailable: "₹78,000",
    theme: {
      gradient: "from-teal-700 to-emerald-600",
      badgeBg: "bg-teal-50",
      badgeText: "text-teal-700",
      progressFill: "bg-teal-600",
      buttonBg: "bg-teal-600",
      buttonHover: "hover:bg-teal-700",
    },
    donationUrl: "/donate?campaign=climate-action-run",
    detailsUrl: "/about",
  },
  {
    id: "init-05",
    slug: "books-study-materials-distribution",
    number: "05",
    title: "BOOKS & STUDY MATERIALS DISTRIBUTION",
    category: "Educational Resources",
    description:
      "“Help provide essential books, notebooks, learning materials, and educational resources to students who need them most.”",
    image: "/hero/hero-08.png",
    icon: Library,
    goalAmount: 300000,
    raisedAmount: 204000,
    availableAmount: 96000,
    percentage: 68,
    formattedGoal: "₹3,00,000",
    formattedRaised: "₹2,04,000",
    formattedAvailable: "₹96,000",
    theme: {
      gradient: "from-amber-600 to-orange-600",
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-700",
      progressFill: "bg-amber-600",
      buttonBg: "bg-amber-600",
      buttonHover: "hover:bg-amber-700",
    },
    donationUrl: "/donate?campaign=books-study-materials-distribution",
    detailsUrl: "/about",
  },
  {
    id: "init-06",
    slug: "cyber-safety-awareness-programme",
    number: "06",
    title: "CYBER SAFETY AWARENESS PROGRAMME",
    category: "Digital Safety & Ethics",
    description:
      "“Support digital-safety education that helps students and communities identify online risks and use technology responsibly.”",
    image: "/hero/hero-07.png",
    icon: ShieldCheck,
    goalAmount: 150000,
    raisedAmount: 84000,
    availableAmount: 66000,
    percentage: 56,
    formattedGoal: "₹1,50,000",
    formattedRaised: "₹84,000",
    formattedAvailable: "₹66,000",
    theme: {
      gradient: "from-sky-700 to-cyan-600",
      badgeBg: "bg-sky-50",
      badgeText: "text-sky-700",
      progressFill: "bg-sky-600",
      buttonBg: "bg-sky-600",
      buttonHover: "hover:bg-sky-700",
    },
    donationUrl: "/donate?campaign=cyber-safety-awareness-programme",
    detailsUrl: "/about",
  },
  {
    id: "init-07",
    slug: "mental-health-awareness-initiative",
    number: "07",
    title: "MENTAL HEALTH AWARENESS INITIATIVE",
    category: "Mental Well-being",
    description:
      "“Help create compassionate spaces for awareness, conversation, stigma reduction, emotional well-being, and access to supportive information.”",
    image: "/hero/hero-03.png",
    icon: HeartHandshake,
    goalAmount: 250000,
    raisedAmount: 145000,
    availableAmount: 105000,
    percentage: 58,
    formattedGoal: "₹2,50,000",
    formattedRaised: "₹1,45,000",
    formattedAvailable: "₹1,05,000",
    theme: {
      gradient: "from-purple-700 to-pink-600",
      badgeBg: "bg-purple-50",
      badgeText: "text-purple-700",
      progressFill: "bg-purple-600",
      buttonBg: "bg-purple-600",
      buttonHover: "hover:bg-purple-700",
    },
    donationUrl: "/donate?campaign=mental-health-awareness-initiative",
    detailsUrl: "/about",
  },
  {
    id: "init-08",
    slug: "health-check-up-camps",
    number: "08",
    title: "HEALTH CHECK-UP CAMPS",
    category: "Preventive Healthcare",
    description:
      "“Support accessible community health check-ups, preventive awareness, and early health guidance for people in underserved areas.”",
    image: "/hero/hero-01.png",
    icon: Stethoscope,
    goalAmount: 400000,
    raisedAmount: 276000,
    availableAmount: 124000,
    percentage: 69,
    formattedGoal: "₹4,00,000",
    formattedRaised: "₹2,76,000",
    formattedAvailable: "₹1,24,000",
    theme: {
      gradient: "from-cyan-700 to-teal-600",
      badgeBg: "bg-cyan-50",
      badgeText: "text-cyan-700",
      progressFill: "bg-cyan-600",
      buttonBg: "bg-cyan-600",
      buttonHover: "hover:bg-cyan-700",
    },
    donationUrl: "/donate?campaign=health-check-up-camps",
    detailsUrl: "/about",
  },
  {
    id: "init-09",
    slug: "sanitation-dengue-awareness-campaign",
    number: "09",
    title: "SANITATION & DENGUE AWARENESS CAMPAIGN",
    category: "Public Health & Hygiene",
    description:
      "“Help communities promote cleanliness, prevent mosquito-borne illness, and build awareness of safer and healthier everyday practices.”",
    image: "/hero/hero-06.png",
    icon: Sparkles,
    goalAmount: 200000,
    raisedAmount: 124000,
    availableAmount: 76000,
    percentage: 62,
    formattedGoal: "₹2,00,000",
    formattedRaised: "₹1,24,000",
    formattedAvailable: "₹76,000",
    theme: {
      gradient: "from-lime-600 to-teal-700",
      badgeBg: "bg-teal-50",
      badgeText: "text-teal-700",
      progressFill: "bg-teal-600",
      buttonBg: "bg-teal-600",
      buttonHover: "hover:bg-teal-700",
    },
    donationUrl: "/donate?campaign=sanitation-dengue-awareness-campaign",
    detailsUrl: "/about",
  },
  {
    id: "init-10",
    slug: "blood-donation-camp",
    number: "10",
    title: "BLOOD DONATION CAMP",
    category: "Community Healthcare",
    description:
      "“Support the organization of voluntary blood-donation camps that bring donors together and strengthen access to life-saving blood.”",
    icon: HeartPulse,
    goalAmount: 250000,
    raisedAmount: 190000,
    availableAmount: 60000,
    percentage: 76,
    formattedGoal: "₹2,50,000",
    formattedRaised: "₹1,90,000",
    formattedAvailable: "₹60,000",
    theme: {
      gradient: "from-red-600 to-rose-700",
      badgeBg: "bg-red-50",
      badgeText: "text-red-700",
      progressFill: "bg-red-600",
      buttonBg: "bg-red-600",
      buttonHover: "hover:bg-red-700",
    },
    donationUrl: "/donate?campaign=blood-donation-camp",
    detailsUrl: "/about",
  },
  {
    id: "init-11",
    slug: "emergency-blood-donation",
    number: "11",
    title: "EMERGENCY BLOOD DONATION",
    category: "Emergency Healthcare Support",
    description:
      "“Help strengthen rapid donor coordination and emergency support when patients and families face an urgent need for blood.”",
    icon: Siren,
    goalAmount: 500000,
    raisedAmount: 315000,
    availableAmount: 185000,
    percentage: 63,
    formattedGoal: "₹5,00,000",
    formattedRaised: "₹3,15,000",
    formattedAvailable: "₹1,85,000",
    theme: {
      gradient: "from-rose-800 to-red-900",
      badgeBg: "bg-rose-50",
      badgeText: "text-rose-800",
      progressFill: "bg-rose-700",
      buttonBg: "bg-rose-800",
      buttonHover: "hover:bg-rose-900",
    },
    donationUrl: "/donate?campaign=emergency-blood-donation",
    detailsUrl: "/about",
  },
];

function InitiativeDonationCard({
  initiative,
  animateProgress,
}: {
  initiative: InitiativeItem;
  animateProgress: boolean;
}) {
  const IconComponent = initiative.icon;
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group relative w-[280px] sm:w-[320px] lg:w-[340px] flex flex-col justify-between bg-pure-white rounded-2xl sm:rounded-3xl border border-soft-border/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden shrink-0 select-none">
      {/* Top Visual Area (Image with gradient overlay or rich themed gradient header) */}
      <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-gradient-to-br from-udbhav-blue-deep to-impact-green">
        {initiative.image && !imgError ? (
          <Image
            src={initiative.image}
            alt={initiative.title}
            fill
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 340px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out select-none"
            draggable={false}
            onError={() => setImgError(true)}
          />
        ) : null}

        {/* Themed Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-tr ${initiative.theme.gradient} opacity-80 mix-blend-multiply`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Initiative Number Badge */}
        <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white font-heading font-bold text-xs tracking-wider">
          #{initiative.number}
        </div>

        {/* Large Initiative Icon */}
        <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-sm">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Badge */}
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-2.5 ${initiative.theme.badgeBg} ${initiative.theme.badgeText}`}
          >
            {initiative.category}
          </span>

          {/* Initiative Title */}
          <h3 className="font-heading text-lg sm:text-xl font-bold text-udbhav-blue-deep leading-snug line-clamp-2 min-h-[48px] mb-2">
            {initiative.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed line-clamp-3 mb-5">
            {initiative.description}
          </p>
        </div>

        {/* Donation Statistics & Animated Progress Bar */}
        <div className="space-y-4 pt-2 border-t border-soft-border/50">
          {/* Financial Metrics: Goal / Raised / Available */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-warm-white/80 rounded-lg p-2 border border-soft-border/40">
              <span className="block text-[10px] text-text-secondary font-semibold uppercase tracking-wider">
                Goal
              </span>
              <span className="block font-heading text-xs sm:text-sm font-bold text-udbhav-blue-deep mt-0.5">
                {initiative.formattedGoal}
              </span>
            </div>

            <div className="bg-warm-white/80 rounded-lg p-2 border border-soft-border/40">
              <span className="block text-[10px] text-text-secondary font-semibold uppercase tracking-wider">
                Raised
              </span>
              <span className="block font-heading text-xs sm:text-sm font-bold text-impact-green mt-0.5">
                {initiative.formattedRaised}
              </span>
            </div>

            <div className="bg-warm-white/80 rounded-lg p-2 border border-soft-border/40">
              <span className="block text-[10px] text-text-secondary font-semibold uppercase tracking-wider">
                Available
              </span>
              <span className="block font-heading text-xs sm:text-sm font-bold text-udbhav-blue-deep/80 mt-0.5">
                {initiative.formattedAvailable}
              </span>
            </div>
          </div>

          {/* Progress Bar Container with Inside Percentage Badge */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-text-secondary mb-1.5">
              <span>Fundraising Progress</span>
              <span className={`font-bold ${initiative.theme.badgeText}`}>
                {initiative.percentage}%
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-soft-border/60 overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${initiative.theme.progressFill}`}
                style={{
                  width: animateProgress
                    ? `${initiative.percentage}%`
                    : "0%",
                }}
              />
            </div>
          </div>

          {/* Action Buttons: Donate Now + View Details */}
          <div className="flex items-center gap-2.5 pt-1">
            <Link
              href={initiative.donationUrl}
              className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-white font-heading font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200 active:scale-95 ${initiative.theme.buttonBg} ${initiative.theme.buttonHover}`}
            >
              DONATE NOW
            </Link>

            <Link
              href={initiative.detailsUrl}
              className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl border border-soft-border hover:border-impact-green/50 text-udbhav-blue-deep font-heading font-semibold text-xs sm:text-sm transition-colors"
            >
              VIEW DETAILS
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function SupportOurInitiativesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const singleSetWidthRef = useRef<number>(0);
  const exactScrollLeftRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollLeftRef = useRef<number>(0);

  // Measure single set width for bidirectional infinite looping
  const measureSetWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const children = track.children;
    const originalCount = SUPPORT_INITIATIVES_DATA.length;
    if (children.length >= originalCount * 2) {
      const firstChild = children[0] as HTMLElement;
      const nextSetChild = children[originalCount] as HTMLElement;
      const setWidth = nextSetChild.offsetLeft - firstChild.offsetLeft;
      if (setWidth > 0) {
        singleSetWidthRef.current = setWidth;
        if (exactScrollLeftRef.current === 0 && containerRef.current) {
          containerRef.current.scrollLeft = setWidth;
          exactScrollLeftRef.current = setWidth;
        }
      }
    }
  }, []);

  const normalizeInfiniteScroll = useCallback(() => {
    const container = containerRef.current;
    const setWidth = singleSetWidthRef.current;
    if (!container || setWidth <= 0) return;

    if (container.scrollLeft >= setWidth * 2) {
      container.scrollLeft -= setWidth;
      exactScrollLeftRef.current -= setWidth;
    } else if (container.scrollLeft <= setWidth * 0.1) {
      container.scrollLeft += setWidth;
      exactScrollLeftRef.current += setWidth;
    }
  }, []);

  const pauseAutoplayTemporarily = useCallback(() => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      const container = containerRef.current;
      if (container) {
        exactScrollLeftRef.current = container.scrollLeft;
      }
      lastTimestampRef.current = null;
      isPausedRef.current = false;
    }, 2400);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    queueMicrotask(() => setReducedMotion(mediaQuery.matches));
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPausedRef.current = true;
      } else {
        lastTimestampRef.current = null;
        isPausedRef.current = false;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      queueMicrotask(() => setIsVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    measureSetWidth();
    window.addEventListener("resize", measureSetWidth);
    return () => window.removeEventListener("resize", measureSetWidth);
  }, [measureSetWidth, isVisible]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  // Time-based right-to-left linear movement (~30px/second calm speed)
  useEffect(() => {
    const speedPixelsPerSecond = 30;

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaSeconds = Math.min(
        (timestamp - lastTimestampRef.current) / 1000,
        0.1
      );
      lastTimestampRef.current = timestamp;

      const container = containerRef.current;
      const setWidth = singleSetWidthRef.current;

      if (
        container &&
        setWidth > 0 &&
        !isPausedRef.current &&
        !isDraggingRef.current &&
        !reducedMotion
      ) {
        exactScrollLeftRef.current += speedPixelsPerSecond * deltaSeconds;
        container.scrollLeft = exactScrollLeftRef.current;
        normalizeInfiniteScroll();
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (isVisible && !reducedMotion) {
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
    };
  }, [isVisible, normalizeInfiniteScroll, reducedMotion]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    dragStartScrollLeftRef.current = containerRef.current?.scrollLeft || 0;
    pauseAutoplayTemporarily();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - dragStartXRef.current) * 1.35;
    containerRef.current.scrollLeft = dragStartScrollLeftRef.current - walk;
    exactScrollLeftRef.current = containerRef.current.scrollLeft;
    normalizeInfiniteScroll();
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      pauseAutoplayTemporarily();
    }
  };

  const handleTouchStart = () => {
    pauseAutoplayTemporarily();
  };

  const handleTouchMove = () => {
    pauseAutoplayTemporarily();
    const container = containerRef.current;
    if (container) {
      exactScrollLeftRef.current = container.scrollLeft;
      normalizeInfiniteScroll();
    }
  };

  const tripleInitiatives = [
    ...SUPPORT_INITIATIVES_DATA,
    ...SUPPORT_INITIATIVES_DATA,
    ...SUPPORT_INITIATIVES_DATA,
  ];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="support-initiatives-heading"
      className="relative w-full overflow-hidden bg-gradient-to-b from-pure-white via-[#FDFCF8] to-warm-white py-16 sm:py-20 md:py-24 border-t border-soft-border/40"
    >
      {/* Restrained subtle atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/4 w-[450px] h-[350px] rounded-full bg-impact-green/5 blur-3xl opacity-75"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-soft-green/40 blur-3xl opacity-60"
      />

      <Container className="relative z-10">
        {/* Section Heading & Emotional Caption */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 lg:mb-16">
          <RevealCard as="div" index={0}>
            <span className="eyebrow-label text-impact-green font-heading text-xs sm:text-sm font-bold tracking-widest uppercase block mb-2">
              MAKE A DIFFERENCE
            </span>
            <h2
              id="support-initiatives-heading"
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-udbhav-blue-deep tracking-tight"
            >
              Support Our Initiatives
            </h2>
          </RevealCard>

          <RevealCard as="div" index={1}>
            <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto mt-3.5">
              “Every contribution becomes a step toward education, well-being,
              sustainability, dignity, and hope. Choose a cause close to your
              heart and help us create meaningful change together.”
            </p>
            <p className="font-heading text-sm sm:text-base font-semibold text-impact-green mt-3">
              “Your support today can transform someone’s tomorrow.”
            </p>
            <div
              aria-hidden="true"
              className="mx-auto h-1 w-14 rounded-full bg-impact-green mt-4"
            />
          </RevealCard>
        </div>
      </Container>

      {/* Synchronized Infinite Carousel Track Container with Edge Fade Mask */}
      <div className="relative w-full overflow-hidden">
        <div
          className="w-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          }}
        >
          <div
            ref={containerRef}
            role="region"
            aria-label="Support UDBHAV Foundation initiatives"
            tabIndex={0}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className={`flex items-stretch gap-6 sm:gap-7 lg:gap-8 overflow-x-auto scrollbar-none py-4 px-4 sm:px-6 focus:outline-none select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div
              ref={trackRef}
              className="flex items-stretch gap-6 sm:gap-7 lg:gap-8 shrink-0"
            >
              {tripleInitiatives.map((initiative, index) => (
                <InitiativeDonationCard
                  key={`${initiative.id}-${index}`}
                  initiative={initiative}
                  animateProgress={isVisible || reducedMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupportOurInitiativesSection;
