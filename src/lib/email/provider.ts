export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  messageId?: string;
  error?: string;
  success: boolean;
}

export interface EmailProvider {
  sendEmail(options: EmailOptions): Promise<EmailResult>;
}
