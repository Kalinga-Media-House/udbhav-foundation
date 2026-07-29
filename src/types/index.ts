/**
 * UDBHAV Foundation Enterprise Type System
 * Central barrel export for all domain models, database schemas, API contracts,
 * RBAC permissions, and utilities. Zero circular dependencies.
 */

// Export all sub-namespaces
export * from './utilities';
export * from './branded';
export * from './base';
export * from './enums';
export * from './api';
export * from './search';
export * from './permissions';
export * from './audit';
export * from './media';
export * from './database';
export * from './domain';
export * from './index-programme';
export * from './gallery';
export * from './news';

// Backward compatibility aliases for Phase 4.1 modules and contracts
export type ID = string;
export type Timestamp = string;

