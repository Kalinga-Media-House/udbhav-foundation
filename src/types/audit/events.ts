/**
 * Represents an immutable audit log event for system activity tracking.
 */
export interface AuditEvent {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  actor_id: string | null;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Metadata associated with an audit event such as request diagnostics.
 */
export interface AuditMetadata {
  ip_address?: string;
  user_agent?: string;
  request_id?: string;
}

/**
 * Execution context captured when recording an audit event.
 */
export interface AuditContext {
  userId: string | null;
  ip?: string;
  userAgent?: string;
}

/**
 * Represents a general user activity feed item or notification log.
 */
export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

/**
 * Generic version history record for entity modification tracking.
 * @template T - The type of the snapshot data at this version.
 */
export interface VersionHistory<T> {
  version: number;
  data: T;
  changed_by: string;
  changed_at: string;
}

/**
 * Represents a single field diff between two entity states.
 */
export interface Diff {
  field: string;
  old_value: unknown;
  new_value: unknown;
}

/**
 * Represents the actor responsible for initiating a change set or audit event.
 */
export interface Actor {
  id: string;
  type: 'user' | 'system' | 'api';
  name?: string;
}

/**
 * Represents the target entity modified in a change set.
 */
export interface Target {
  id: string;
  type: string;
  label?: string;
}

/**
 * A comprehensive change set describing who changed what, when, and exact diffs.
 */
export interface ChangeSet {
  actor: Actor;
  target: Target;
  diffs: Diff[];
  timestamp: string;
}
