import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Hardcoded production domain
const SITE_URL = 'https://dash.shrillecho.app'

const premiumRoutes = ['/premium']

const createSupabaseClient = (request: NextRequest) => {
    let supabaseResponse = NextResponse.next({ request })
    return {
        client: createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                        supabaseResponse = NextResponse.next({ request })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
            }
        ),
        response: supabaseResponse
    }
}

const redirectWithCookies = (request: NextRequest, path: string) => {
    // Create absolute URL with the hardcoded domain
    const redirectUrl = new URL(path, SITE_URL).toString()
    const response = NextResponse.redirect(redirectUrl)

    request.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value)
    })
    return response
}

const checkPremiumAccess = async (supabase: ReturnType<typeof createServerClient>, userId: string) => {
    const { data } = await supabase.from('Account').select('status').eq('userId', userId).single()
    return data?.status === 'ACTIVE'
}

export async function updateSession(request: NextRequest) {
    const { client: supabase, response: supabaseResponse } = createSupabaseClient(request)
    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    if (!user) {
        // Not authenticated - redirect to auth page
        if (path !== '/auth') {
            return redirectWithCookies(request, '/auth')
        }
    } else {
        // Authenticated - handle redirects
        if (path === '/auth') {
            return redirectWithCookies(request, '/')
        }

        if (premiumRoutes.includes(path)) {
            if (!await checkPremiumAccess(supabase, user.id)) {
                return redirectWithCookies(request, '/')
            }
        }
    }

    return supabaseResponse
}