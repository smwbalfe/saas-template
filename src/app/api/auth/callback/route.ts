import { NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'

// google auth callback
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    console.log('Auth callback received with code:', code ? 'present' : 'missing')
    const next = searchParams.get('next') ?? '/auth'
    
    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const forwardedProto = request.headers.get('x-forwarded-proto')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            
            console.log('Auth successful, redirecting to:', next)
            console.log('Environment:', isLocalEnv ? 'development' : 'production')
            console.log('Forwarded host:', forwardedHost || 'none')
            console.log('Forwarded proto:', forwardedProto || 'none')

            // if (isLocalEnv) {
            //     return NextResponse.redirect(`http://localhost:3000${next}`)
            // } else if (forwardedHost && forwardedProto) {
            //     return NextResponse.redirect(`${forwardedProto}://${forwardedHost}${next}`)
            // } else {
            const baseUrl = "https://dash.shrillecho.app"
            return NextResponse.redirect(`${baseUrl}${next}`)
            // }
        }
    } else {
        console.error('No auth code provided in callback')
    }

    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_APP_URL
    return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`)
}