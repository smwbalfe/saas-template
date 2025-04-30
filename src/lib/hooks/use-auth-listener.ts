import { useState, useEffect } from 'react'
import { supabaseBrowserClient } from '@/src/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { logSupabaseEvent } from '../actions/log-auth-status'

/*
    Client side listener to update the user as the backend session is updated
*/
export const useAuthListener = () => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        const initializeAuth = async () => {
            const { data } = await supabaseBrowserClient.auth.getSession()
            setUser(data.session?.user || null)
            setLoading(false)
        }

        initializeAuth()

        const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(async (event, _session) => {
            setUser(_session?.user || null)
            if (event === 'SIGNED_OUT') {
                if (window.location.pathname !== '/auth') {
                    router.push('/auth')
                }
            } else if (event === 'SIGNED_IN') {
                if (window.location.pathname === '/auth') {
                    router.push('/')
                } else {
                    router.refresh()
                }
            } else if (event === 'TOKEN_REFRESHED') {
                router.refresh()
            }
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [router])

    return { user, loading }
}