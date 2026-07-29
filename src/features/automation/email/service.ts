import { emailProvider, EmailOptions } from '@/lib/email';

import { EmailLogRepository } from './repository';

export const EmailService = {
  async sendEmail(
    options: EmailOptions, 
    templateName: string
  ): Promise<boolean> {
    const toAddress = Array.isArray(options.to) ? options.to.join(', ') : options.to;
    
    // Create initial log
    const log = await EmailLogRepository.createLog({
      recipient: toAddress,
      template: templateName,
      status: 'queued',
      provider: 'resend',
    });

    const result = await emailProvider.sendEmail(options);

    // Update log based on result
    await EmailLogRepository.updateLog(log.id, {
      status: result.success ? 'sent' : 'failed',
      provider_message_id: result.messageId,
      error_message: result.error,
      sent_at: result.success ? new Date().toISOString() : null,
    });

    return result.success;
  }
};
