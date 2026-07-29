/**
 * @file database.ts
 * @description Helper utility types for extracting row, insert, update, and enum types from the generated database schema.
 */

import type { Database } from './database.generated';

/**
 * Helper type to extract the `Row` interface for a specific table in the database schema.
 * @template T - Table name key from `Database['public']['Tables']`.
 */
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

/**
 * Helper type to extract the `Insert` interface for a specific table in the database schema.
 * @template T - Table name key from `Database['public']['Tables']`.
 */
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

/**
 * Helper type to extract the `Update` interface for a specific table in the database schema.
 * @template T - Table name key from `Database['public']['Tables']`.
 */
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

/**
 * Helper type to extract an enum type from the database schema.
 * @template T - Enum name key from `Database['public']['Enums']`.
 */
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
