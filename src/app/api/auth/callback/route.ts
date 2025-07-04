import { NextResponse } from 'next/server'
import { makeServerClient } from '@/src/lib/supabase/server'
import { createOrUpdateUserAccount } from '@/src/lib/actions/create-user'
import env from '@/src/lib/env'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'
    
    if (code) {
        const supabase = await makeServerClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error) {

            await createOrUpdateUserAccount(data.user.id)
            
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = env.NODE_ENV === 'development'
            
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}