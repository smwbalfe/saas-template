'use client'
import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { createTokenPayment, confirmPayment } from '../actions/token-payment'
import { useUser } from '../features/auth/hooks/use-user'

export const useTokenPayment = () => {
    const stripe = useStripe()
    const elements = useElements()
    const { user } = useUser()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const processPayment = async (amount: number, description?: string) => {
        if (!stripe || !elements || !user) {
            setError('Payment system not ready or user not authenticated')
            return { success: false }
        }

        setIsLoading(true)
        setError(null)

        try {
            const cardElement = elements.getElement(CardElement)
            if (!cardElement) {
                throw new Error('Card element not found')
            }

            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    email: user.email,
                }
            })

            if (stripeError) {
                throw new Error(stripeError.message)
            }

            if (!paymentMethod) {
                throw new Error('Failed to create payment method')
            }

            const result = await createTokenPayment({
                userId: user.id,
                email: user.email!,
                amount,
                description,
                paymentMethodId: paymentMethod.id
            })

            if (result.requiresAction && result.clientSecret) {
                const { error: confirmError } = await stripe.confirmCardPayment(result.clientSecret)
                if (confirmError) {
                    throw new Error(confirmError.message)
                }
                
                const confirmResult = await confirmPayment(result.paymentIntentId!)
                if (!confirmResult.success) {
                    throw new Error(confirmResult.error || 'Payment confirmation failed')
                }
                return { success: true, amount }
            }

            if (!result.success) {
                throw new Error(result.error || 'Payment failed')
            }

            return { success: true, amount: result.amount }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment failed'
            setError(errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setIsLoading(false)
        }
    }

    return {
        processPayment,
        isLoading,
        error,
        clearError: () => setError(null)
    }
} 