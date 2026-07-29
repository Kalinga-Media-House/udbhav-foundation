import { ROUTE_MATCHERS } from './matcher';

export const isPublicRoute = (pathname: string): boolean => {
  return ROUTE_MATCHERS.PUBLIC.some(regex => regex.test(pathname));
};

export const isAuthRoute = (pathname: string): boolean => {
  return ROUTE_MATCHERS.AUTH.some(regex => regex.test(pathname));
};

export const isAdminRoute = (pathname: string): boolean => {
  return ROUTE_MATCHERS.ADMIN.some(regex => regex.test(pathname));
};

export const isApiRoute = (pathname: string): boolean => {
  return ROUTE_MATCHERS.API.some(regex => regex.test(pathname));
};
