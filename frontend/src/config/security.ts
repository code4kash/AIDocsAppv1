import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers middleware
export function securityHeaders(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'Content-Security-Policy',
    cspHeader.replace(/\s{2,}/g, ' ').trim()
  );
  requestHeaders.set('X-DNS-Prefetch-Control', 'on');
  requestHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  requestHeaders.set('X-Frame-Options', 'DENY');
  requestHeaders.set('X-Content-Type-Options', 'nosniff');
  requestHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  requestHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return requestHeaders;
}

// CSRF protection middleware
export function csrfProtection(req: NextRequest) {
  const requestHeaders = securityHeaders(req);
  
  // Generate CSRF token
  const csrfToken = Buffer.from(crypto.randomUUID()).toString('base64');
  requestHeaders.set('X-CSRF-Token', csrfToken);
  
  // Set CSRF token in cookie
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  response.cookies.set('csrf-token', csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  
  return response;
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Secure cookie configuration
export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
}; 