import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    if (!user) {
        if (!path.startsWith('/auth')) {
            const url = request.nextUrl.clone()
            url.pathname = '/auth'
            const newResponse = NextResponse.redirect(url)
            request.cookies.getAll().forEach((cookie) => {
                newResponse.cookies.set(cookie.name, cookie.value)
            })
            return newResponse
        }
    } else {
        if (path.startsWith('/auth')) {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            const newResponse = NextResponse.redirect(url)
            request.cookies.getAll().forEach((cookie) => {
                newResponse.cookies.set(cookie.name, cookie.value)
            })
            return newResponse
        }
    }

    return supabaseResponse
}