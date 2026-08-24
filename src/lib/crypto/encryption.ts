/**
 * AES-256-GCM encryption/decryption for sensitive integration tokens.
 * Uses INTEGRATION_SECRET_KEY environment variable as the master key.
 * Never import this module in client components.
 */
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM standard
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const secret = process.env.INTEGRATION_SECRET_KEY;
  if (!secret) {
    throw new Error(
      'INTEGRATION_SECRET_KEY environment variable is not set. ' +
      'Generate a 32+ character random string and add it to your environment.'
    );
  }
  // Derive a 256-bit key from the secret using SHA-256
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a base64-encoded string containing: IV + ciphertext + authTag.
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Pack as: IV (12) + ciphertext (variable) + authTag (16)
  const packed = Buffer.concat([iv, encrypted, authTag]);
  return packed.toString('base64');
}

/**
 * Decrypts a base64-encoded AES-256-GCM ciphertext.
 * Expects the format produced by encrypt(): IV + ciphertext + authTag.
 */
export function decrypt(ciphertext: string): string {
  const key = getKey();
  const packed = Buffer.from(ciphertext, 'base64');

  if (packed.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error('Invalid ciphertext: too short');
  }

  const iv = packed.subarray(0, IV_LENGTH);
  const authTag = packed.subarray(packed.length - AUTH_TAG_LENGTH);
  const encrypted = packed.subarray(IV_LENGTH, packed.length - AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Check whether the encryption key is configured.
 * Use this to show "not configured" UI rather than crashing.
 */
export function isEncryptionConfigured(): boolean {
  return !!process.env.INTEGRATION_SECRET_KEY;
}
