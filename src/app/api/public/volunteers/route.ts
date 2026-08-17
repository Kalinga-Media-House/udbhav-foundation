import { NextResponse } from "next/server";

import { volunteersService } from "@/features/volunteers";
import { serverLogger } from "@/lib/logger/server-logger";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "All";
    const q = searchParams.get("q") || "";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "12");

    const filters: Record<string, unknown> = {};
    if (type !== "All") filters.volunteer_type = type;
    if (q) filters.search = q;

    const result = await volunteersService.listPublicProfiles({ page, limit }, filters);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to list public volunteers." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        volunteers: result.data?.data || [],
        total: result.data?.total || 0,
        page: result.data?.page || 1,
        limit: result.data?.limit || 12,
      },
      { status: 200 }
    );
  } catch (err) {
    serverLogger.error("Public Volunteers GET error", err instanceof Error ? err : new Error(String(err)));
    return NextResponse.json(
      { error: "Internal server error while fetching public volunteers." },
      { status: 500 }
    );
  }
}
