'use client'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import EmailForm from '../lib/components/contact-form'
import { Auth } from '@supabase/auth-ui-react'
import {ThemeSupa} from '@supabase/auth-ui-shared'
import { client } from '@/src/lib/supabase'
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)


export default function Home() {

  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  client?.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null)
  })

  client?.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
    if (session?.user) {
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

  const fetchUserData = async () => {
    if (!user || !client) {
      console.log("User or client not found")
    }
    console.log("User found:", user)
    const { data, error } = await client
      .from('users')
      .select('*')
      .limit(10)
    if (error) {
      console.error('Error:', error)
      return
    }
    console.log('User data:', data)
    return data
  }

  const handleCheckout = () => {
    setIsLoading(true)
    fetch('/api/checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: 'price_1R7iY4P74SCuSPeLfB4MSpuy',
        userId: user?.id
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        return stripePromise.then((stripe) => {
          return stripe?.redirectToCheckout({
            sessionId: session.sessionId
          });
        });
      })
      .then(function (result) {
        if (result?.error) {
          alert(result?.error.message);
        }
      })
      .catch(function (error) {
        console.error('Checkout error:', error);
      })
      .finally(function () {
        setIsLoading(false);
      });
  }

  if (!client) return null

  return (
    <div>
      {user ? (
        <div>
          <h1>You are signed in hello</h1>
          <button onClick={() => alert(user.id)}>Show User ID</button>
          <button onClick={fetchUserData}>Fetch User Data</button>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Subscribe Now'}
          </button>
          <button onClick={() => client.auth.signOut()}>Sign Out</button>
          <EmailForm />
        </div>
      ) : (
        <div style={{maxWidth: '400px', margin: '0 auto'}}>
          <Auth
            supabaseClient={client}
              appearance={{ theme: ThemeSupa  }}
            providers={['google']}
          />
        </div>
      )}
    </div>
  )
}