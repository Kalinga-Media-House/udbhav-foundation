import { EventName } from '../events/types';
import { eventHandlers } from '../handlers';

import { BackgroundJobRepository } from './repository';

export const QueueWorker = {
  async processNextJob(): Promise<boolean> {
    const job = await BackgroundJobRepository.getNextJob();
    if (!job) {
      return false; // No jobs to process
    }

    try {
      // Mark as processing
      await BackgroundJobRepository.updateJob(job.id, {
        status: 'processing',
        updated_at: new Date().toISOString()
      });

      const eventName = job.job_type as EventName;
      const handler = eventHandlers[eventName];

      if (!handler) {
        throw new Error(`No handler registered for event: ${eventName}`);
      }

      // Execute handler
      await handler(job.payload as any);

      // Mark as completed
      await BackgroundJobRepository.updateJob(job.id, {
        status: 'completed',
        updated_at: new Date().toISOString()
      });

      return true;

    } catch (error: any) {
      const nextAttempt = job.attempt + 1;
      const isFailed = nextAttempt >= job.max_attempts;
      
      // Calculate next retry time with exponential backoff (e.g. 5 mins, 25 mins, 2 hours)
      const delayMinutes = Math.pow(5, nextAttempt);
      const nextRetryAt = new Date(Date.now() + delayMinutes * 60000).toISOString();

      await BackgroundJobRepository.updateJob(job.id, {
        status: isFailed ? 'failed' : 'queued',
        attempt: nextAttempt,
        last_error: error.message || 'Unknown error',
        next_retry_at: isFailed ? null : nextRetryAt,
        updated_at: new Date().toISOString()
      });

      return true;
    }
  }
};
