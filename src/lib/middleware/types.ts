import { NextResponse, type NextRequest } from 'next/server';

export type RouteConfig = {
  matcher: RegExp;
  allowedRoles?: string[];
};

export type MiddlewareContext = {
  req: NextRequest;
  res: NextResponse;
};
