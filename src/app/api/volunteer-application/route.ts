import { NextResponse } from "next/server";

import { volunteersService } from "@/features/volunteers";
import { serverLogger } from "@/lib/logger/server-logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await volunteersService.submitApplication(body);

    if (!result.success) {
      // Sanitize error: never expose database internals to public users
      const isValidationError = result.error && !result.error.includes('schema cache') && !result.error.includes('SQLSTATE') && !result.error.includes('relation') && !result.error.includes('column');
      const userMessage = isValidationError
        ? result.error
        : "Unable to submit your application right now. Please try again in a moment.";
      
      if (!isValidationError) {
        serverLogger.error("Volunteer application submission failed (sanitized)", new Error(result.error || "Unknown error"));
      }
      
      return NextResponse.json(
        { error: userMessage },
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

