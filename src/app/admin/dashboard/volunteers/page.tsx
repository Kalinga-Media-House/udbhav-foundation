import type { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

import { AdminVolunteersClient } from "@/components/admin/volunteers/AdminVolunteersClient";
import { requireAuth } from "@/contracts/actions";
import {
  listVolunteers,
  listVolunteerApplications,
} from "@/features/volunteers";

export const metadata: Metadata = {
  title: "Volunteer Management | Admin CMS",
  description: "Admin portal for managing UDBHAV Foundation volunteers and applications.",
};

export default async function AdminVolunteersPage() {
  try {
    await requireAuth();
    const [volRes, appRes] = await Promise.all([
      listVolunteers({ page: 1, limit: 100 }),
      listVolunteerApplications({ page: 1, limit: 100 }),
    ]);

    return (
      <div className="p-8 max-w-7xl mx-auto">
        <AdminVolunteersClient
          initialVolunteers={volRes.data?.data || []}
          initialApplications={appRes.data?.data || []}
        />
      </div>
    );
  } catch {
    redirect("/login?redirect=/admin/dashboard/volunteers");
  }
}
