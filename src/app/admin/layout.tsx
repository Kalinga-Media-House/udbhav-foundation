import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Retrieve authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Authoritative server-side role check
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

  if (roleError || !roleData) {
    // If no role found or error during retrieval, sign them out and redirect to unauthorized
    await supabase.auth.signOut();
    redirect("/login?error=unauthorized");
  }

  // Verify that the role is active and valid
  const validRoles = [
    "super_admin",
    "admin",
    "content_admin",
    "programme_admin",
  ];

  if (!roleData.is_active || !validRoles.includes(roleData.role)) {
    await supabase.auth.signOut();
    redirect("/login?error=unauthorized");
  }

  // If authorized, render the admin dashboard or nested admin pages
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
