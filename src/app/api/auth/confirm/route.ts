import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { createOrUpdateUserAccount } from '@/src/lib/utils'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'

    if (!token_hash || !type) {
        redirect('/error')
    }

    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
    })

    if (error) {
        redirect('/error')
    }

    if (data.user) {
        await createOrUpdateUserAccount(data.user.id)
    }
    
    redirect(next)
}