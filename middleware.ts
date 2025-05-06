import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = [
  'https://fasmotorsports.com',
  'https://www.fasmotorsports.com',
  'http://localhost:4321',
  'http://localhost:3000',
  'https://fasmotorsports.io',
  'https://www.fasmotorsports.io'
]

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  const corsHeaders = new Headers()
  if (isAllowedOrigin) {
    corsHeaders.set('Access-Control-Allow-Origin', origin)
    corsHeaders.set('Access-Control-Allow-Credentials', 'true')
  }
  corsHeaders.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  corsHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  const response = NextResponse.next()
  for (const [key, value] of Array.from(corsHeaders.entries())) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}