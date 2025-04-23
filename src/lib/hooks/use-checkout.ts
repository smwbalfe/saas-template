import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const useCheckout = (userId: string | undefined) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleCheckout = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: 'price_1R7iY4P74SCuSPeLfB4MSpuy',
                    userId
                }),
            })
            const session = await response.json()
            const stripe = await stripePromise
            const result = await stripe?.redirectToCheckout({
                sessionId: session.sessionId
            })
            if (result?.error) {
                alert(result.error.message)
            }
        } catch (error) {
            console.error('Checkout error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return { handleCheckout, isLoading }
} 