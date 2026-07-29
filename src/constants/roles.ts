export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  MEMBER: 'MEMBER',
  GUEST: 'GUEST',
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];
