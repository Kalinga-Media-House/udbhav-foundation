import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { volunteersService } from "@/features/volunteers";
import { serverLogger } from "@/lib/logger/server-logger";
import { getStorageConfig } from "@/lib/storage/config";
import { deleteFile } from "@/lib/storage/delete";
import { downloadFileInternal } from "@/lib/storage/download-internal";
import { sanitizePath } from "@/lib/storage/helpers";
import { processImage } from "@/lib/storage/image-pipeline";
import { uploadFile } from "@/lib/storage/upload";

export async function POST(request: Request) {
  let finalStorageKey: string | null = null;
  let tempStorageKey: string | null = null;

  try {
    const body = await request.json();
    tempStorageKey = body.tempStorageKey;

    // Phase 1: Photo Processing (if present)
    let profilePictureUrl = body.profilePictureUrl || null;

    if (tempStorageKey) {
      try {
        // Download temp file
        const downloadRes = await downloadFileInternal(tempStorageKey);
        if (!downloadRes.data) {
          throw new Error('Failed to retrieve the uploaded temporary photo.');
        }

        const originalFilename = body.originalFilename || 'photo.jpg';
        // Process with sharp
        const processed = await processImage(downloadRes.data, originalFilename);
        
        // Generate permanent key
        const finalExtension = processed.format === 'gif' ? '.gif' : `.${processed.format}`;
        const safeFilename = `profile-${Date.now()}${finalExtension}`;
        finalStorageKey = sanitizePath('volunteer-profiles', safeFilename);
        const bucket = getStorageConfig().defaultBucket;

        // Upload optimized permanent file
        const uploadRes = await uploadFile(processed.buffer, safeFilename, {
          contentType: processed.mimeType,
          folder: 'volunteer-profiles',
          bucket,
          key: finalStorageKey,
        });

        if (uploadRes.error || !uploadRes.data) {
          throw new Error('Failed to save optimized photo.');
        }

        // Get CDN URL
        profilePictureUrl = `${getStorageConfig().publicUrl}/${finalStorageKey}`;
        body.profilePictureUrl = profilePictureUrl;
      } catch (e) {
        serverLogger.error("Error processing volunteer profile photo", e as Error);
        return NextResponse.json(
          { error: "Failed to process the uploaded photo. Please try submitting without it." },
          { status: 400 }
        );
      }
    }

    // Phase 2: Database Submission
    const result = await volunteersService.submitApplication(body);

    if (!result.success) {
      // Rollback permanent photo if database insertion failed
      if (finalStorageKey) {
        await deleteFile(finalStorageKey).catch(e => {
          serverLogger.error("Failed to cleanup orphaned volunteer photo", e as Error);
        });
      }

      // Specific handling for duplicate applications
      if (result.error && result.error.startsWith('DUPLICATE_APPLICATION')) {
        const statusMatch = result.error.split(':');
        const status = statusMatch.length > 1 ? statusMatch[1] : 'pending';
        let customMessage = "An application with this mobile number or email address has already been submitted. Your application is currently under review.";
        
        if (status === 'Verified' || status === 'Accepted' || status === 'active') {
          customMessage = "Your volunteer application has already been approved. Our team will contact you with the next steps.";
        } else if (status === 'Rejected' || status === 'rejected') {
          customMessage = "An application with this mobile number or email address already exists. Please contact UDBHAV if you need further assistance.";
        } else {
          customMessage = "Your application has already been submitted. Our team will review your application and contact you.";
        }

        return NextResponse.json(
          {
            error: "DUPLICATE_APPLICATION",
            message: customMessage,
          },
          { status: 409 }
        );
      }

      // Sanitize error
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

    // Phase 3: Cleanup temporary file after everything succeeded
    if (tempStorageKey) {
      deleteFile(tempStorageKey).catch(e => {
        // Just log, don't fail the request since application is already saved
        serverLogger.error("Failed to cleanup temporary volunteer photo", e as Error);
      });
    }

    revalidateTag("volunteers");

    return NextResponse.json(
      {
        success: true,
        message:
          "Volunteer application submitted successfully. Our team will contact you soon.",
      },
      { status: 200 }
    );
  } catch (err) {
    // Rollback permanent photo if unexpected error
    if (finalStorageKey) {
      await deleteFile(finalStorageKey).catch(() => {});
    }
    
    serverLogger.error("Volunteer Application POST error", err instanceof Error ? err : new Error(String(err)));
    return NextResponse.json(
      { error: "Internal server error while processing volunteer application." },
      { status: 500 }
    );
  }
}
