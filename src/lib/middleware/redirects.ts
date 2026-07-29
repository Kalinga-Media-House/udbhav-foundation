import { NextResponse } from 'next/server';

import { ROUTES } from '@/constants/routes';

export const redirectToLogin = (url: string) => {
  const loginUrl = new URL(ROUTES.AUTH.LOGIN, url);
  // Optional: append original URL as a 'next' query param
  return NextResponse.redirect(loginUrl);
};

export const redirectToDashboard = (url: string) => {
  return NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, url));
};

export const redirectToForbidden = (url: string) => {
  // A generic 403 page or dashboard
  return NextResponse.redirect(new URL('/', url)); 
};
