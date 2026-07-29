import { EmailProvider } from './provider';
import { ResendProvider } from './resend';

// Abstract factory to easily swap providers later
export const emailProvider: EmailProvider = new ResendProvider();

export * from './provider';
