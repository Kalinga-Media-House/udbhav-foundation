/**
 * Google OAuth 2.0 Callback Route.
 * 
 * Handles the redirect from Google's OAuth consent screen.
 * Validates: state (HMAC + expiry + CSRF), Super Admin session, and exchanges code for tokens.
 * 
 * Security:
 * - State parameter is cryptographically signed and time-limited
 * - Session must belong to the same Super Admin who initiated the flow
 * - Tokens are encrypted before database storage
 * - Access tokens are never persisted
 */
import { NextRequest, NextResponse } from 'next/server';

import { requireAuth, requireSuperAdminAuth } from '@/contracts/actions';
import { auditLogger } from '@/lib/logger/audit-logger';
import { serverLogger } from '@/lib/logger/server-logger';

import { validateOAuthState } from '@/features/google-integrations/oauth-state';
import { googleIntegrationsRepository } from '@/features/google-integrations/repository';
import { exchangeCodeForTokens } from '@/features/google-integrations/service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const baseRedirect = '/admin/integrations/google';

  // 1. Handle user denial
  if (error) {
    serverLogger.warn('Google OAuth denied by user', { error });
    return NextResponse.redirect(
      new URL(`${baseRedirect}?error=access_denied&message=${encodeURIComponent('Google authorization was denied.')}`, request.url)
    );
  }

  // 2. Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      new URL(`${baseRedirect}?error=invalid_request&message=${encodeURIComponent('Missing authorization code or state.')}`, request.url)
    );
  }

  try {
    // 3. Authenticate and verify Super Admin
    let session;
    try {
      session = await requireAuth();
      requireSuperAdminAuth(session);
    } catch {
      return NextResponse.redirect(
        new URL(`${baseRedirect}?error=unauthorized&message=${encodeURIComponent('Super Admin access required.')}`, request.url)
      );
    }

    // 4. Validate OAuth state (HMAC, expiry, CSRF, service)
    const { service } = validateOAuthState(state, session.id);

    // 5. Exchange authorization code for tokens
    const { refreshToken, email, scopes } = await exchangeCodeForTokens(code);

    // 6. Store encrypted refresh token in database
    const result = await googleIntegrationsRepository.upsertConnection({
      service,
      googleAccountEmail: email,
      refreshToken,
      scopes,
      userId: session.id,
    });

    if (!result.data) {
      throw new Error('Failed to store integration credentials.');
    }

    // 7. Audit log (no secrets)
    auditLogger.logAction(session.id, 'GOOGLE_ACCOUNT_CONNECTED', 'google_integrations', {
      service,
      googleAccountEmail: email,
    });

    // 8. Redirect back to integrations page with success
    return NextResponse.redirect(
      new URL(
        `${baseRedirect}?success=true&service=${service}&message=${encodeURIComponent(`${service} connected successfully.`)}`,
        request.url
      )
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    // Log full error server-side but never expose secrets to the redirect URL
    serverLogger.error('Google OAuth callback error', err instanceof Error ? err : new Error(String(err)));

    return NextResponse.redirect(
      new URL(
        `${baseRedirect}?error=callback_error&message=${encodeURIComponent(message)}`,
        request.url
      )
    );
  }
}
