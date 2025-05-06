import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = [
  'https://fasmotorsports.com',
  'http://localhost:4321',
]

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  if (req.method === 'OPTIONS') {
    const preflightHeaders = new Headers()
    if (isAllowedOrigin) {
      preflightHeaders.set('Access-Control-Allow-Origin', origin)
      preflightHeaders.set('Access-Control-Allow-Credentials', 'true')
    }
    preflightHeaders.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    preflightHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return new Response(null, { status: 204, headers: preflightHeaders })
  }

  const res = NextResponse.next()

  if (isAllowedOrigin) {
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return res
}