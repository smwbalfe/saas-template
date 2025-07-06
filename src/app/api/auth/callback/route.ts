import { NextResponse } from 'next/server'
import { makeServerClient } from '@/src/lib/supabase/server'
import { createOrUpdateUserAccount } from '@/src/lib/actions/create-user'
import env from '@/src/lib/env'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'
    
    if (code) {
        const supabase = await makeServerClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error) {
            try {
                await createOrUpdateUserAccount(data.user.id)
            } catch (e) {
                console.error('Error creating user account:', e)
            }
            return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}${next}`)
        }
    }

    return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/auth/auth-code-error`)
}