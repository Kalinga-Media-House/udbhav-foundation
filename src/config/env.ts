import { publicEnv } from "./public-env";
import { serverEnv } from "./server-env";

/**
 * The unified, fully-typed environment configuration object.
 * Server actions and utilities should import `env` from here.
 * Client components MUST import exclusively from `./public-env` to avoid bundling errors.
 */
export const env = {
  ...publicEnv,
  ...serverEnv,
} as const;

export type Env = typeof env;
