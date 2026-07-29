/**
 * Features Barrel Export.
 *
 * This file provides a unified import surface for the entire backend service layer.
 * Components and pages should import from `@/features` or `@/features/<module>`.
 *
 * DEPENDENCY RULE: Features never import from each other at the repository level.
 * Cross-feature orchestration happens ONLY at the service or action layer.
 */

// --- Core Domain Modules ---
export * as programs from './programs';
export * as events from './events';
export * as volunteers from './volunteers';
export * as news from './news';
export * as gallery from './gallery';
export * as donations from './donations';
export * as contacts from './contacts';
export * as indexInitiatives from './index';

// --- Platform Modules ---
export * as media from './media';
export * as profiles from './profiles';
export * as notifications from './notifications';
export * as dashboard from './dashboard';
