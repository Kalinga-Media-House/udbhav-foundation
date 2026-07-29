import { EmailService } from '../email/service';
import { DonationCompletedPayload } from '../events/types';
import { NotificationRepository } from '../notifications/repository';
import { PDFService } from '../pdf/service';

export const handleDonationCompleted = async (payload: DonationCompletedPayload): Promise<void> => {
  // 1. Generate PDF receipt
  const receiptUrl = await PDFService.generateAndStoreReceipt({
    id: payload.donationId,
    donorName: payload.donorName,
    amount: payload.amount,
    currency: payload.currency,
    date: new Date(),
    receiptNumber: payload.receiptNumber
  });

  // 2. Send Email
  await EmailService.sendEmail({
    to: 'donor@example.com', // In reality, we'd fetch the donor's email from the DB using donorId
    subject: `Thank you for your donation to UDBHAV Foundation!`,
    html: `
      <h1>Thank You, ${payload.donorName}!</h1>
      <p>We received your donation of ${payload.currency} ${payload.amount}.</p>
      <p>Your tax receipt is available here: <a href="${receiptUrl}">Download Receipt</a></p>
    `
  }, 'donation-receipt');

  // 3. Send In-App Notification
  await NotificationRepository.createNotification({
    recipient_id: payload.donorId, // Using the alias conceptually
    category: 'transactional',
    priority: 'high',
    severity: 'success',
    title: 'Donation Received',
    message: `Thank you! Your donation of ${payload.currency} ${payload.amount} was successful.`,
    action_url: `/dashboard/donations/${payload.donationId}`,
    source_module: 'donations'
  });
};
