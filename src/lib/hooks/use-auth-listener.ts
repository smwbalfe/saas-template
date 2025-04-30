import { useState, useEffect } from 'react'
import { supabaseBrowserClient } from '@/src/lib/supabase/client'
import { logSupabaseEvent } from '../actions/log-auth-status'

export const useAuthListener = () => {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initializeAuth = async () => {
            const { data: { user: currentUser } } = await supabaseBrowserClient.auth.getUser()
            setUser(currentUser)
        }

        initializeAuth()

        const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(async (event, session) => {
            
            if (event === 'SIGNED_OUT') {
                setUser(null)
                if (window.location.pathname !== '/auth') {
                    window.location.href = '/auth'
                }
            } else if (event === 'SIGNED_IN') {
                setUser(session?.user)
                if (window.location.pathname === '/auth') {
                    window.location.href = '/'
                }
            } else if (event === 'PASSWORD_RECOVERY') {
                const newPassword = prompt('Enter your new password')
                if (newPassword) {
                    try {
                        const { error } = await supabaseBrowserClient.auth.updateUser({ password: newPassword })
                        if (error) throw error
                        alert('Password updated successfully')
                    } catch (error: any) {
                        alert(error.message)
                    }
                }
            }
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    return { user, loading }
}