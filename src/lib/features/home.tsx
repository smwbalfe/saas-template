"use client"

import { supabaseBrowserClient } from '@/src/lib/supabase/client'
import { useAuthListener } from '@/src/lib/hooks/use-auth-listener'
import { useEffect, useState } from 'react'

export const Navbar = () => {
    const { user } = useAuthListener()
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {
        if (user) {
            const checkSubscription = async () => {
                const { data: account } = await supabaseBrowserClient
                    .from('Account')
                    .select('status')
                    .eq('userId', user.id)
                    .single()
                setIsSubscribed(account?.status === 'ACTIVE')
            }
            checkSubscription()
        }
    }, [user])

    return (
        <div>
            <h1>dashboard</h1>
        </div>
    )
}