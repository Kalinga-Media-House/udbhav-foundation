import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shared/SectionPlaceholder";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of use and guidelines for accessing and utilizing UDBHAV Foundation's digital platform.",
};

export default function TermsOfUsePage() {
  return (
    <SectionPlaceholder
      eyebrow="ORGANIZATION POLICIES"
      title="Terms of Use"
      description="Guidelines and terms governing community engagement and interaction on our digital platform."
    />
  );
}
