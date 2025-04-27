import { NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    const next = searchParams.get('next') ?? '/auth'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                console.log('redirecting to 1', `${origin}${next}`)
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                console.log('redirecting to 2', `https://${forwardedHost}${next}`)

                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                console.log('redirecting to 3', `${origin}${next}`)
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }
    console.log('redirecting to 4', `${origin}/auth/auth-code-error`)
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
