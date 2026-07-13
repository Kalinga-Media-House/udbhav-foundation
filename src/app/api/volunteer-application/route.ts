import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      mobileNumber,
      age,
      occupation,
      cityDistrict,
      state,
      preferredAreas,
      skills,
      availability,
      motivation,
      consent,
    } = body;

    // Server-side validation
    if (
      !fullName ||
      !email ||
      !mobileNumber ||
      !occupation ||
      !cityDistrict ||
      !state ||
      !Array.isArray(preferredAreas) ||
      preferredAreas.length === 0 ||
      !availability ||
      !motivation ||
      !consent
    ) {
      return NextResponse.json(
        { error: "Missing required fields or consent." },
        { status: 400 }
      );
    }

    const cleanMobile = String(mobileNumber).replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      return NextResponse.json(
        { error: "Invalid Indian mobile number format." },
        { status: 400 }
      );
    }

    // Secure optional Supabase service role insertion
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      try {
        const insertResponse = await fetch(
          `${supabaseUrl}/rest/v1/volunteer_applications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: serviceRoleKey,
              Authorization: `Bearer ${serviceRoleKey}`,
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              full_name: fullName,
              email,
              mobile_number: cleanMobile,
              age: age || null,
              occupation,
              city_district: cityDistrict,
              state,
              preferred_areas: preferredAreas,
              skills: skills || null,
              availability,
              motivation,
              consent,
              status: "pending",
            }),
          }
        );

        if (!insertResponse.ok) {
          console.error(
            "Supabase insert failed:",
            await insertResponse.text()
          );
        }
      } catch (dbError) {
        console.error("Database connection note:", dbError);
      }
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
    console.error("Volunteer Application POST error:", err);
    return NextResponse.json(
      { error: "Internal server error while processing volunteer application." },
      { status: 500 }
    );
  }
}
