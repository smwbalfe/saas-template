'use server'
import Stripe from 'stripe'
import { STRIPE_CUSTOMER_ID_KV } from '../stripe/stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia'
})

export type TokenPaymentRequest = {
    userId: string
    email: string
    amount: number
    currency?: string
    description?: string
    paymentMethodId: string
}

export async function createTokenPayment(data: TokenPaymentRequest) {
    const { userId, email, amount, currency = 'usd', description, paymentMethodId } = data

    if (!userId || !paymentMethodId || !amount) {
        return { success: false, error: 'Missing required fields' }
    }

    try {
        let stripeCustomerId = await STRIPE_CUSTOMER_ID_KV.get(userId)
        
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email,
                metadata: { userId }
            })
            await STRIPE_CUSTOMER_ID_KV.set(userId, customer.id)
            stripeCustomerId = customer.id
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            customer: stripeCustomerId as string,
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
            description,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
            metadata: {
                userId
            }
        })

        if (paymentIntent.status === 'requires_action') {
            return {
                success: false,
                requiresAction: true,
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret
            }
        }

        if (paymentIntent.status === 'succeeded') {
            return {
                success: true,
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount / 100
            }
        }

        return {
            success: false,
            error: `Payment failed with status: ${paymentIntent.status}`
        }

    } catch (error) {
        console.error('Token payment error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Payment failed'
        }
    }
}

export async function confirmPayment(paymentIntentId: string) {
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId)
        return {
            success: paymentIntent.status === 'succeeded',
            status: paymentIntent.status,
            clientSecret: paymentIntent.client_secret
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Confirmation failed'
        }
    }
} 