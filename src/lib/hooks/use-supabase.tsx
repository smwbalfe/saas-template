
'use client'
import { useSession } from '@clerk/nextjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export function useSupabaseClient() {
    const { session } = useSession()
    const [client, setClient] = useState<SupabaseClient | null>(null)

    useEffect(() => {
        if (!session) return

        const supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_KEY!,
            {
                global: {
                    fetch: async (url, options = {}) => {
                        const clerkToken = await session?.getToken({
                            template: 'supabase',
                        })
                        const headers = new Headers(options?.headers)
                        headers.set('Authorization', `Bearer ${clerkToken}`)
                        return fetch(url, {
                            ...options,
                            headers,
                        })
                    },
                },
            },
        )

        setClient(supabaseClient)
    }, [session])

    return client
}