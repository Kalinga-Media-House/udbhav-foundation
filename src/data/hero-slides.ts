/**
 * Future-proof Hero Slide configuration and TypeScript types.
 * Structured ready for future Admin/Supabase integration where slides can be dynamic.
 */

export interface HeroSlideAction {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  heading: string;
  description: string;
  primaryAction: HeroSlideAction;
  secondaryAction: HeroSlideAction;
  image: string;
  imageAlt: string;
  objectPosition?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    eyebrow: "UDBHAV FOUNDATION",
    heading: "Growing Together for an Inclusive Future",
    description:
      "Empowering communities through education, inclusion, environmental responsibility and collective action.",
    primaryAction: {
      label: "Explore Our Work",
      href: "/index",
    },
    secondaryAction: {
      label: "Join as a Volunteer",
      href: "/volunteers",
    },
    image: "/hero/hero-01.png",
    imageAlt:
      "UDBHAV Foundation community gathering and collaborative empowerment",
    objectPosition: "center center",
  },
  {
    id: "slide-2",
    eyebrow: "EDUCATION & EMPOWERMENT",
    heading: "Creating Opportunities Through Education",
    description:
      "Supporting learning, awareness and equal opportunities so every individual can grow with confidence and dignity.",
    primaryAction: {
      label: "Explore Our Programmes",
      href: "/index",
    },
    secondaryAction: {
      label: "About UDBHAV",
      href: "/about",
    },
    image: "/hero/hero-02.png",
    imageAlt:
      "UDBHAV Foundation educational initiatives supporting children and youth",
    objectPosition: "center 35%",
  },
  {
    id: "slide-3",
    eyebrow: "INCLUSION & WELL-BEING",
    heading: "Building Communities Where Everyone Belongs",
    description:
      "Advancing inclusion, mental well-being and compassionate action through meaningful community participation.",
    primaryAction: {
      label: "Discover Our Impact",
      href: "/news-and-stories",
    },
    secondaryAction: {
      label: "Join Our Community",
      href: "/volunteers",
    },
    image: "/hero/hero-03.png",
    imageAlt:
      "UDBHAV Foundation inclusion and mental well-being community engagement",
    objectPosition: "center 30%",
  },
  {
    id: "slide-4",
    eyebrow: "ENVIRONMENT & COLLECTIVE ACTION",
    heading: "Small Actions. Meaningful Change.",
    description:
      "Bringing people together to protect the environment and create a more responsible and sustainable future.",
    primaryAction: {
      label: "View Our Initiatives",
      href: "/index",
    },
    secondaryAction: {
      label: "Support Our Mission",
      href: "/donate",
    },
    image: "/hero/hero-04.png",
    imageAlt:
      "UDBHAV Foundation environmental responsibility and collective community action",
    objectPosition: "center center",
  },
];
