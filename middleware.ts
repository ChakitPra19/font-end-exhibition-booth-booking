import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // ตรวจสอบเฉพาะ path /mybooking
  if (request.nextUrl.pathname.startsWith('/mybooking')) {
    const token = request.cookies.get('token')?.value
    if (!token) {
      // redirect ไปหน้า login
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }
  }
  return NextResponse.next()
}

// ระบุ matcher ให้ middleware ทำงานเฉพาะ path ที่ต้องการ
export const config = {
  matcher: ['/mybooking']
}
