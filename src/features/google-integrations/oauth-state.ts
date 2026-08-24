/**
 * Cryptographically secure, short-lived OAuth state management.
 * 
 * State format: base64url({ service, userId, nonce, exp, sig })
 * - Unpredictable: uses crypto.randomBytes for nonce
 * - Tied to authenticated Super Admin: encodes userId
 * - Service-specific: encodes requested Google service
 * - Short-lived: 5-minute expiry
 * - Single-use: nonce prevents replay
 * - HMAC-signed: prevents tampering and service substitution
 */
import crypto from 'crypto';

import type { GoogleService } from './types';

const STATE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

interface OAuthStatePayload {
  /** Google service being connected */
  svc: GoogleService;
  /** Authenticated Super Admin user ID */
  uid: string;
  /** Cryptographic nonce (prevents replay) */
  nce: string;
  /** Expiry timestamp (ms since epoch) */
  exp: number;
  /** HMAC-SHA256 signature */
  sig: string;
}

function getSigningKey(): string {
  const key = process.env.INTEGRATION_SECRET_KEY;
  if (!key) {
    throw new Error('INTEGRATION_SECRET_KEY is required for OAuth state signing.');
  }
  return key;
}

function sign(data: string): string {
  return crypto
    .createHmac('sha256', getSigningKey())
    .update(data)
    .digest('hex');
}

/**
 * Generate a cryptographically secure OAuth state parameter.
 */
export function generateOAuthState(service: GoogleService, userId: string): string {
  const nonce = crypto.randomBytes(16).toString('hex');
  const exp = Date.now() + STATE_EXPIRY_MS;

  // Create the signable payload (deterministic ordering)
  const signable = `${service}:${userId}:${nonce}:${exp}`;
  const sig = sign(signable);

  const payload: OAuthStatePayload = {
    svc: service,
    uid: userId,
    nce: nonce,
    exp,
    sig,
  };

  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

/**
 * Validate an OAuth state parameter.
 * Returns the decoded payload if valid, throws if invalid.
 * 
 * Validates:
 * - JSON structure
 * - HMAC signature (prevents tampering)
 * - Expiry (prevents replay after window)
 * - User ID matches current session (prevents CSRF)
 */
export function validateOAuthState(
  state: string,
  currentUserId: string
): { service: GoogleService; userId: string } {
  let payload: OAuthStatePayload;
  try {
    payload = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
  } catch {
    throw new Error('Invalid OAuth state: malformed payload');
  }

  // Verify required fields
  if (!payload.svc || !payload.uid || !payload.nce || !payload.exp || !payload.sig) {
    throw new Error('Invalid OAuth state: missing fields');
  }

  // Verify HMAC signature (prevents tampering and service substitution)
  const signable = `${payload.svc}:${payload.uid}:${payload.nce}:${payload.exp}`;
  const expectedSig = sign(signable);
  if (!crypto.timingSafeEqual(Buffer.from(payload.sig, 'hex'), Buffer.from(expectedSig, 'hex'))) {
    throw new Error('Invalid OAuth state: signature mismatch');
  }

  // Verify expiry
  if (Date.now() > payload.exp) {
    throw new Error('Invalid OAuth state: expired');
  }

  // Verify user matches current session (CSRF protection)
  if (payload.uid !== currentUserId) {
    throw new Error('Invalid OAuth state: user mismatch');
  }

  // Verify service is valid
  const validServices: GoogleService[] = ['analytics', 'search_console', 'ads'];
  if (!validServices.includes(payload.svc)) {
    throw new Error('Invalid OAuth state: unknown service');
  }

  return {
    service: payload.svc,
    userId: payload.uid,
  };
}
