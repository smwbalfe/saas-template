import { useState, useEffect } from 'react'
import { supabaseBrowserClient } from '@/src/lib/supabase/client'
import { sendEmail } from '../actions/email'

export const useAuthListener = () => {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        supabaseBrowserClient?.auth.getSession().then(({ data: { session } }) => {
            console.log('Session', session)
            if (session?.user) {
                setUser(session.user)
            } else {
                setUser(null)
            }
        })

        const { data: { subscription } } = supabaseBrowserClient?.auth.onAuthStateChange(async (event, session) => {
            console.log("event", event)
            if (event === 'SIGNED_OUT') {
                setUser(null)
            } else if (event === 'SIGNED_IN') {
                setUser(session?.user)
                sendEmail({ name: session?.user.user_metadata.name ?? '', email: session?.user.email ?? '', userId: session?.user.id ?? ''})
            } else if (event === 'PASSWORD_RECOVERY'){
               const newPassword = prompt('Enter your new password') 
               const {data, error} = await supabaseBrowserClient.auth.updateUser({password: newPassword!})
               if (data) { alert('Password updated successfully')}
               if (error) { alert(error.message)}
            } 
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    return { user }
}