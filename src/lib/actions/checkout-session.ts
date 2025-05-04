'use server'
import Stripe from 'stripe';
import env from '../env';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey);

type CheckoutRequestBody = {
    userId: string;
    line_item: {
        price: string;
        quantity: number;
    }
}

export async function createCheckoutSession(formData: CheckoutRequestBody) {

    const { userId, line_item } = formData;

    if (!userId) {
        throw new Error('User ID is required');
    }

    try {
       
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: line_item.price,
                quantity: line_item.quantity
            }],
            mode: 'subscription',
            success_url: `${env.NEXT_PUBLIC_APP_URL}/premium?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${env.NEXT_PUBLIC_APP_URL}/canceled`,
            subscription_data: {
                metadata: {
                    userId: userId
                }
            }
        });
        return { success: true, sessionId: session.id };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: false,
            error: 'An unknown error occurred'
        };
    }
}