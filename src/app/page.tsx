'use client'
import { SignedIn, SignOutButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { useSupabaseClient } from '@/src/lib/hooks/use-supabase'
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import EmailForm from '../lib/components/contact-form'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Home() {
  const { user, isSignedIn } = useUser()
  const client = useSupabaseClient()
  const [isLoading, setIsLoading] = useState(false)

  const fetchUserData = async () => {
    if (!isSignedIn || !client) return
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
        clerkId: user?.id
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

  

  return (
    <div>
      {
        isSignedIn ? (
          <div>
            <h1>You are signed in hello</h1>
            <button onClick={fetchUserData}>Fetch User Data</button>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Subscribe Now'}
            </button>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignOutButton>
            </SignOutButton>
            <EmailForm />
          </div>
        ) : (
          <div>
            <SignUpButton>
            </SignUpButton>
          </div>
        )
      }
    </div>
  )
}