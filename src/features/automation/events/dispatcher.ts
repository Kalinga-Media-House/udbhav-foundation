import { AutomationAuditRepository } from '../audit/repository';
import { BackgroundJobRepository } from '../queue/repository';

import { EventName, EventPayloads } from './types';

export const EventDispatcher = {
  async emit<T extends EventName>(
    eventName: T,
    payload: EventPayloads[T]
  ): Promise<void> {
    // 1. Log the event being emitted
    await AutomationAuditRepository.createLog({
      event_name: eventName,
      triggered_by: payload.triggeredBy || null,
      handler: 'EventDispatcher',
      status: 'success',
      metadata: payload as any
    });

    // 2. Queue background job to process handlers
    // In a production system, this could dispatch to an actual queue worker like Inngest/BullMQ
    // Here we use our custom DB-backed BackgroundJob queue
    await BackgroundJobRepository.enqueueJob({
      job_type: eventName,
      payload: payload as any,
      status: 'queued',
      max_attempts: 3
    });
  }
};
