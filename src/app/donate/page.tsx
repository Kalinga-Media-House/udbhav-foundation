import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/shared/SectionPlaceholder";

export const metadata: Metadata = {
  title: "Support Our Mission",
  description:
    "Support UDBHAV Foundation's community initiatives across Odisha through transparent contributions.",
};

export default function DonatePage() {
  return (
    <SectionPlaceholder
      eyebrow="SUPPORT & CONTRIBUTIONS"
      title="Support Our Mission"
      description="Your support enables UDBHAV Foundation to expand grassroots education, mental well-being, and inclusive development programs."
    />
  );
}
