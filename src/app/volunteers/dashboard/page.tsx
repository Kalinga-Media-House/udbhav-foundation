import type { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

import { VolunteerDashboardClient } from "@/components/volunteers/VolunteerDashboardClient";
import { requireAuth } from "@/contracts/actions";
import { getVolunteerDashboardData } from "@/features/volunteers";

export const metadata: Metadata = {
  title: "Volunteer Dashboard | UDBHAV Foundation",
  description:
    "Personal volunteer portal to track hours, assignments, and certificates.",
};

export default async function VolunteerDashboardPage() {
  try {
    await requireAuth();
    const result = await getVolunteerDashboardData();
    if (!result.success || !result.data) {
      redirect("/login?redirect=/volunteers/dashboard");
    }
    return <VolunteerDashboardClient initialData={result.data} />;
  } catch {
    redirect("/login?redirect=/volunteers/dashboard");
  }
}
