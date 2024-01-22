import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoutes, protectedRoutes } from "./router/routes";

export default async function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('refresh_token')?.value as string;

  if (protectedRoutes.includes(request.nextUrl.pathname) &&
     (!currentUser || Date.now() > JSON.parse(currentUser).refresh_token.expiresIn)
  ) {
    request.cookies.delete('refresh_token');
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('refresh_token');

    return response;
  }

  if (authRoutes.includes(request.nextUrl.pathname) && 
     (currentUser && Date.now() < JSON.parse(currentUser).refresh_token.expiresIn)
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}