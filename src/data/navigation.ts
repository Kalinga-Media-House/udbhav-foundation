export interface NavItem {
  label: string;
  href: string;
  group?: "main" | "action" | "footer-quick" | "footer-explore" | "legal";
}

/**
 * Single source of truth for UDBHAV Foundation navigation links across
 * global Header, Mobile Menu drawer, and Footer.
 */
export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", group: "main" },
  { label: "About", href: "/about", group: "main" },
  { label: "Core Team", href: "/core-team", group: "main" },
  { label: "Index", href: "/programmes", group: "main" },
  { label: "Volunteers", href: "/volunteers", group: "main" },
  { label: "News & Stories", href: "/news-and-stories", group: "main" },
  { label: "Gallery", href: "/gallery", group: "main" },
];

export const ACTION_NAV_ITEMS: NavItem[] = [
  { label: "Login", href: "/login", group: "action" },
  { label: "Donate", href: "/donate", group: "action" },
];

export const FOOTER_QUICK_LINKS: NavItem[] = [
  { label: "Home", href: "/", group: "footer-quick" },
  { label: "About", href: "/about", group: "footer-quick" },
  { label: "Core Team", href: "/core-team", group: "footer-quick" },
  { label: "Index", href: "/programmes", group: "footer-quick" },
  { label: "Volunteers", href: "/volunteers", group: "footer-quick" },
];

export const FOOTER_EXPLORE_LINKS: NavItem[] = [
  { label: "News & Stories", href: "/news-and-stories", group: "footer-explore" },
  { label: "Gallery", href: "/gallery", group: "footer-explore" },
  { label: "Donate", href: "/donate", group: "footer-explore" },
  { label: "Contributors", href: "/contributors", group: "footer-explore" },
  { label: "Login", href: "/login", group: "footer-explore" },
];

export const FOOTER_LEGAL_LINKS: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy", group: "legal" },
  { label: "Terms of Use", href: "/terms-of-use", group: "legal" },
];
