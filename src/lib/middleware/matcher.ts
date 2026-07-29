export const ROUTE_MATCHERS = {
  PUBLIC: [
    /^\/$/,
    /^\/about\/?$/,
    /^\/contact\/?$/,
    /^\/events(\/.*)?$/,
  ],
  AUTH: [
    /^\/auth\/login\/?$/,
    /^\/auth\/register\/?$/,
    /^\/auth\/forgot-password\/?$/,
    /^\/auth\/reset-password\/?$/,
  ],
  ADMIN: [
    /^\/admin(\/.*)?$/,
  ],
  API: [
    /^\/api(\/.*)?$/,
  ]
};
