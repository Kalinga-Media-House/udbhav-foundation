/**
 * Represents an assigned user role in the RBAC system.
 */
export interface Role {
  id: string;
  name: string;
  description?: string | null;
}

/**
 * Represents a discrete permission rule in the RBAC system.
 */
export interface Permission {
  id: string;
  key: string;
  description?: string | null;
}

/**
 * Represents an action-subject ability pair with optional conditional restrictions.
 */
export interface Ability {
  action: string;
  subject: string;
  conditions?: Record<string, unknown>;
}

/**
 * Represents a security policy grouping multiple abilities together.
 */
export interface Policy {
  id: string;
  name: string;
  abilities: Ability[];
}

/**
 * Contextual information for evaluating authorization rules during a request.
 */
export interface AuthorizationContext {
  userId: string;
  role: string;
  permissions: string[];
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Represents an active user authentication session.
 */
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
}

/**
 * Represents JWT token claims for an authenticated identity.
 */
export interface Claims {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

/**
 * Represents an authenticated user in the current execution context.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

/**
 * Special role type representing an internal background or automated service.
 */
export interface ServiceRole {
  role: 'service_role';
  isSuperAdmin: true;
}

/**
 * Role type representing an unauthenticated or anonymous user.
 */
export interface Anonymous {
  role: 'anon';
}

/**
 * Role type representing an administrative user.
 */
export interface Admin {
  role: 'Admin' | 'SuperAdmin';
}

/**
 * Role type representing a super administrator user with full privileges.
 */
export interface SuperAdmin {
  role: 'SuperAdmin';
}

/**
 * User session information including assigned roles and permissions.
 */
export interface UserSession {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}
