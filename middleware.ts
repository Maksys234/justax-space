// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  // Обновляем сессию пользователя, если она истекла.
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Сопоставляем все пути запросов, кроме:
     * - путей, начинающихся с /api (маршруты API)
     * - путей, начинающихся с /_next/static (статические файлы)
     * - путей, начинающихся с /_next/image (файлы оптимизации изображений)
     * - путей, заканчивающихся на .png (изображения)
     */
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}