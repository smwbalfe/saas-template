// hooks/useCheckout.ts
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface CheckoutOptions {
    successUrl?: string;
    cancelUrl?: string;
    mode?: 'payment' | 'subscription' | 'setup';
    metadata?: Record<string, string>;
}

export function useCheckout() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCheckoutSession = async (options: CheckoutOptions = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    success_url: options.successUrl,
                    cancel_url: options.cancelUrl,
                    mode: options.mode || 'payment',
                    metadata: options.metadata || {},
                }),
            });

            const { sessionId, error: responseError } = await response.json();

            if (responseError) {
                throw new Error(responseError);
            }

            if (!sessionId) {
                throw new Error('No session ID returned from checkout API');
            }
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Failed to load Stripe');
            }
            const { error: stripeError } = await stripe.redirectToCheckout({
                sessionId,
            });

            if (stripeError) {
                throw new Error(stripeError.message || 'Unknown Stripe error');
            }

            return { sessionId };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            return { error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        createCheckoutSession,
        loading,
        error,
    };
}