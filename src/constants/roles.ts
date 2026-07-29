export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VOLUNTEER_MANAGER: 'volunteer-manager',
  CONTENT_MANAGER: 'content-manager',
  MEDIA_MANAGER: 'media-manager',
  FINANCE_MANAGER: 'finance-manager',
  VOLUNTEER: 'volunteer',
  MEMBER: 'member',
  GUEST: 'guest',
} as const;

/** Set of role slugs that grant access to the admin dashboard. */
export const ADMIN_ROLES = new Set([
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.EDITOR,
  ROLES.CONTENT_MANAGER,
  ROLES.MEDIA_MANAGER,
  ROLES.FINANCE_MANAGER,
  ROLES.VOLUNTEER_MANAGER,
]);

export type RoleType = (typeof ROLES)[keyof typeof ROLES];
