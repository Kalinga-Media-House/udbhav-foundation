import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/shared/SectionPlaceholder";

export const metadata: Metadata = {
  title: "Contributors & Supporters",
  description:
    "Honoring the community partners, volunteers, and supporters advancing UDBHAV Foundation's impact.",
};

export default function ContributorsPage() {
  return (
    <SectionPlaceholder
      eyebrow="COMMUNITY SUPPORTERS"
      title="Contributors & Partners"
      description="Recognizing the collective community of volunteers, educators, and institutional partners supporting our mission."
    />
  );
}
