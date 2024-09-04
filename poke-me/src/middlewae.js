import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Assuming you want to use getToken from next-auth

export async function middleware(request) {
  const token = await getToken({ req: request });

  // Example: If the user is not authenticated, redirect them to the sign-in page
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If the user is authenticated, allow the request to continue
  return NextResponse.next();
}

// Configure the paths where the middleware should apply
export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/dashboard/:path*',
    '/verify/:path*',
  ],
};
