"use client"

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { client } from '@/src/lib/supabase/client'
import { useCheckout } from '@/src/lib/hooks/use-checkout'
import { useAuthListener } from '@/src/lib/hooks/use-auth-listener'

export const Home = () => {
    const { user } = useAuthListener()
    const { handleCheckout, isLoading } = useCheckout(user?.id)
    return (
        <div className="container mx-auto px-4 py-8">
            {user ? (
                <div className="max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">You are signed in hello</h1>
                    <div className="space-y-4">
                        <button
                            onClick={() => alert(user.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
                        >
                            Show User ID
                        </button>
                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : 'Subscribe Now'}
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
                            onClick={() => client.auth.signOut()}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-w-md mx-auto">
                    <Auth
                        supabaseClient={client}
                        appearance={{ theme: ThemeSupa }}
                        providers={['google']}
                    />
                </div>
            )}
        </div>
    )
}