import { EventName, EventPayloads } from '../events/types';

import { handleDonationCompleted } from './donation';

export type EventHandler<T extends EventName> = (payload: EventPayloads[T]) => Promise<void>;

export const eventHandlers: {
  [K in EventName]?: EventHandler<K>;
} = {
  'DONATION_COMPLETED': handleDonationCompleted as EventHandler<'DONATION_COMPLETED'>,
  // Other events can be wired up here as they are implemented
};
