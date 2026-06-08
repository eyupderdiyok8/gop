import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  // Redirect to a static, high-quality image to save CPU resources
  return NextResponse.redirect(new URL('/images/su-aritma-servis34.webp', req.url));
}
