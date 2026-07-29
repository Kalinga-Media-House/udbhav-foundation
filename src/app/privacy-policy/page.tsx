import type { Metadata } from "next";

import { SectionPlaceholder } from "@/components/shared/SectionPlaceholder";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Official UDBHAV Foundation website privacy policy and personal information stewardship guidelines.",
};

export default function PrivacyPolicyPage() {
  return (
    <SectionPlaceholder
      eyebrow="ORGANIZATION POLICIES"
      title="Privacy Policy"
      description="Our commitment to transparency, data dignity, and safeguarding community information."
    />
  );
}
