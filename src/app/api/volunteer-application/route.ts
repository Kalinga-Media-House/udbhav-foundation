import { NextResponse } from "next/server";

import { volunteersService } from "@/features/volunteers";
import { serverLogger } from "@/lib/logger/server-logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await volunteersService.submitApplication(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Missing required fields or consent." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Volunteer application submitted successfully. Our team will contact you soon.",
      },
      { status: 200 }
    );
  } catch (err) {
    serverLogger.error("Volunteer Application POST error", err instanceof Error ? err : new Error(String(err)));
    return NextResponse.json(
      { error: "Internal server error while processing volunteer application." },
      { status: 500 }
    );
  }
}

