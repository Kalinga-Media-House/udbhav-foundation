import type { Metadata } from "next";
import { IndexHeroSection } from "@/components/index-page/IndexHeroSection";
import { ProgrammeDirectorySection } from "@/components/index-page/ProgrammeDirectorySection";
import { CollectiveImpactSection } from "@/components/index-page/CollectiveImpactSection";
import { AdhyayaFlagshipSection } from "@/components/index-page/AdhyayaFlagshipSection";

export const metadata: Metadata = {
  title: "Programmes & Initiatives Index | UDBHAV FOUNDATION",
  description:
    "Explore UDBHAV Foundation’s 11 official community action programmes advancing education, environmental responsibility, health, inclusion, awareness, and community empowerment across Odisha.",
};

export default function IndexPage() {
  return (
    <main className="min-h-screen bg-[#FCFCF8]">
      <IndexHeroSection />
      <ProgrammeDirectorySection />
      <CollectiveImpactSection />
      <AdhyayaFlagshipSection />
    </main>
  );
}
