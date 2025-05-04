import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.redirect(url)
}
const checkPremiumAccess = async (supabase: ReturnType<typeof createServerClient>, userId: string) => {
    const { data } = await supabase.from('Account').select('status').eq('userId', userId).single()
    return { hasAccess: data?.status === 'ACTIVE' }
}

export async function updateSession(request: NextRequest) {
    const { client: supabase, response: supabaseResponse } = createSupabaseClient(request)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) return supabaseResponse

    const path = request.nextUrl.pathname
    
    if (!user) {
        if (!path.startsWith('/auth')) {
            return redirectWithCookies(request, '/auth')
        }
    } else {
        if (path.startsWith('/auth')) {
            return redirectWithCookies(request, '/')
        }
        if (premiumRoutes.includes(path)) {
            const hasAccess = await checkPremiumAccess(supabase, user.id)
            if (!hasAccess) {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }
    }
    return supabaseResponse
}