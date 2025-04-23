import { useState, useEffect } from 'react'
import { client } from '@/src/lib/supabase/client'

export const useAuthListener = () => {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        client?.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        const { data: { subscription } } = client?.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
            if (event === 'SIGNED_IN' && session?.user) {
                fetch('/api/account/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: session.user.id
                    }),
                })
            }
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    return { user }
} 