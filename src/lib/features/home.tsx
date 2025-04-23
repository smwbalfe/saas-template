import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { client } from '@/src/lib/supabase/client'
import { useCheckout } from '@/src/lib/hooks/use-checkout'
import { useAuthListener } from '@/src/lib/hooks/use-auth-listener'

export const Home = () => {
    const { user } = useAuthListener()
    const { handleCheckout, isLoading } = useCheckout(user?.id)

    return (
        <div>
            {user ? (
                <div>
                    <h1>You are signed in hello</h1>
                    <button onClick={() => alert(user.id)}>Show User ID</button>
                    <button
                        onClick={handleCheckout}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Subscribe Now'}
                    </button>
                    <button onClick={() => client.auth.signOut()}>Sign Out</button>
                </div>
            ) : (
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
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