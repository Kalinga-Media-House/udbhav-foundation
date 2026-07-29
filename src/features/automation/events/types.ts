export type EventName = 
  | 'DONATION_COMPLETED'
  | 'VOLUNTEER_APPROVED'
  | 'CONTACT_CREATED'
  | 'PROGRAM_CREATED'
  | 'EVENT_REGISTERED'
  | 'NEWS_PUBLISHED'
  | 'USER_REGISTERED';

export interface BaseEventPayload {
  triggeredBy?: string;
  metadata?: Record<string, any>;
}

export interface DonationCompletedPayload extends BaseEventPayload {
  donationId: string;
  donorId: string;
  donorName: string;
  amount: number;
  currency: string;
  receiptNumber: string;
}

export type EventPayloads = {
  'DONATION_COMPLETED': DonationCompletedPayload;
  'VOLUNTEER_APPROVED': BaseEventPayload & { volunteerId: string };
  'CONTACT_CREATED': BaseEventPayload & { contactId: string };
  'PROGRAM_CREATED': BaseEventPayload & { programId: string };
  'EVENT_REGISTERED': BaseEventPayload & { eventId: string, participantId: string };
  'NEWS_PUBLISHED': BaseEventPayload & { articleId: string };
  'USER_REGISTERED': BaseEventPayload & { userId: string };
};
