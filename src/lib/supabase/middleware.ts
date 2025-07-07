import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { STRIPE_CACHE_KV, STRIPE_CUSTOMER_ID_KV } from '../stripe/stripe'
import { STRIPE_SUB_CACHE } from '../stripe/types'
import env from '../env'

const premiumRoutes = ['/dashboard']

const createSupabaseClient = (request: NextRequest) => {
    let supabaseResponse = NextResponse.next({ request })
    return {
        client: createServerClient(
            env.NEXT_PUBLIC_SUPABASE_URL,
            env.NEXT_PUBLIC_SUPABASE_KEY,
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

async function getStripeSubByUserId(userId: string) {
    const stripeCustomerId = await STRIPE_CUSTOMER_ID_KV.get(userId)
    if (!stripeCustomerId) return null
    return STRIPE_CACHE_KV.get(stripeCustomerId as string)
}

async function checkSubscription(userId: string) {
    const stripeSub = await getStripeSubByUserId(userId) as STRIPE_SUB_CACHE
    return stripeSub?.status === 'active' 
}

export async function updateSession(request: NextRequest) {
    const { client: supabase, response: supabaseResponse } = createSupabaseClient(request)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    const path = request.nextUrl.pathname   

    if (error) {
        if(!path.startsWith('/auth')) {
            return redirectWithCookies(request, '/auth')
        }
    }
    
    if (!user) {
        if (!path.startsWith('/auth')) {
            return redirectWithCookies(request, '/auth')
        }
    } else {
        if (path.startsWith('/auth')) {
            return redirectWithCookies(request, '/')
        }
        if (premiumRoutes.includes(path)) {
            const hasAccess = await checkSubscription(user.id)
            if (!hasAccess) {
                return NextResponse.redirect(new URL('/', request.url))
            }
        }
    }
    return supabaseResponse
}