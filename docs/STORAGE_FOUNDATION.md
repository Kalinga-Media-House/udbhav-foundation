# UDBHAV Foundation - Storage Foundation Architecture

This document dictates how the platform interacts with Cloudflare R2 (S3 API).

## Core Principles
1. **Never interact directly with S3 SDK from features.** Always import from `@/lib/storage`.
2. **Server-Side Only.** The R2 Admin client and S3 commands MUST only run on the server to prevent credential leakage.
3. **No Large Payloads through Next.js.** For files > 4MB (Vercel limit), use `generatePresignedUploadUrl()` to let the browser upload directly to Cloudflare R2.

## Upload Workflows

### 1. Small Files (e.g. Avatars, < 4MB)
- Use a Server Action.
- Read `FormData`.
- Call `uploadFile(buffer, filename, { contentType })`.

### 2. Large Files (e.g. Documents, High-Res Images)
- Client calls a Server Action to request an upload endpoint.
- Server Action calls `generatePresignedUploadUrl()`.
- Server returns the `url` and `key` to the client.
- Client runs a native `fetch(url, { method: 'PUT', body: file })`.
- Client submits the `key` back to the Server Action to save in the Database.

## Security Model
- **Credentials:** `R2_SECRET_ACCESS_KEY` is completely isolated in `config.ts` which has a runtime guard preventing execution in the browser.
- **Sanitization:** `generateUniqueFilename()` entirely strips out the original filename's structure, replacing it with a UUID + slug to prevent any form of Directory Traversal attack.
