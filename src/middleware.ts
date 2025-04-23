import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {

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
                },
            },
        }
    )
    const { data: { user } } = await supabase.auth.getUser()
 
    if (user) {
        const { data: account } = await supabase
            .from('Account')
            .select('status')
            .eq('userId', user.id)
            .single()

        console.log("account", account)
        if (account?.status !== 'ACTIVE') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    } 

    return NextResponse.next()
}

export const config = {
    matcher: ['/premium']
}
