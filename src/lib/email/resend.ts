import { Resend } from 'resend';


import { EmailProvider, EmailOptions, EmailResult } from './provider';

export class ResendProvider implements EmailProvider {
  private resend: Resend;
  private defaultFrom: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');
    this.defaultFrom = process.env.RESEND_DEFAULT_FROM || 'UDBHAV Foundation <noreply@udbhavfoundation.org>';
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: options.from || this.defaultFrom,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (e: any) {
      return { success: false, error: e.message || 'Unknown error' };
    }
  }
}
