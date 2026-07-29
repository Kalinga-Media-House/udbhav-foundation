import type { Database } from '@/types/database/database.generated';

export type RoleRow = Database['public']['Tables']['roles']['Row'];

export type Role = Database['public']['Tables']['roles']['Row'];
export type Permission = Database['public']['Tables']['permissions']['Row'];
export type RolePermission = Database['public']['Tables']['role_permissions']['Row'];
