'use server'
import Stripe from 'stripe';
import { prisma } from '@/src/lib/prisma';
import env from '@/src/lib/env';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia'
});

type CheckoutRequestBody = {
    userId: string;
    email: string;
    name?: string;
    line_item: {
        price: string;
        quantity: number;
    }
}

export async function createCheckoutSession(formData: CheckoutRequestBody) {
    console.log(`[Checkout] Starting checkout process for user: ${formData.userId}`);
    const { userId, email, name, line_item } = formData;

    if (!userId) {
        console.error(`[Checkout] Error: User ID is required`);
        throw new Error('User ID is required');
    }

    try {
        console.log(`[Checkout] Looking up account for user: ${userId}`);
        const account = await prisma.account.findUnique({
            where: { userId }
        });
        console.log(`[Checkout] Account found: ${!!account}, Stripe customer ID: ${account?.stripeCustomerId || 'none'}`);

        let customerId = account?.stripeCustomerId;

        if (!customerId) {
            console.log(`[Checkout] No Stripe customer found, creating new customer for email: ${email}`);
            const customer = await stripe.customers.create({
                email,
                name,
                metadata: { userId }
            });
            
            customerId = customer.id;
            console.log(`[Checkout] Created new Stripe customer: ${customerId}`);

            console.log(`[Checkout] Updating account with new Stripe customer ID`);
            await prisma.account.update({
                where: { userId },
                data: { stripeCustomerId: customerId }
            });
            console.log(`[Checkout] Account updated successfully`);
        }

        console.log(`[Checkout] Creating checkout session for customer: ${customerId}`);
        console.log(`[Checkout] Line item: price=${line_item.price}, quantity=${line_item.quantity}`);
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
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

        console.log(`[Checkout] Checkout session created successfully: ${session.id}`);
        console.log(`[Checkout] Success URL: ${env.NEXT_PUBLIC_APP_URL}/premium?session_id={CHECKOUT_SESSION_ID}`);
        return { success: true, sessionId: session.id };
    } catch (error) {
        console.error(`[Checkout] Error during checkout process:`, error);
        if (error instanceof Error) {
            console.error(`[Checkout] Error message: ${error.message}`);
            return { success: false, error: error.message };
        }
        console.error(`[Checkout] Unknown error type`);
        return { success: false, error: 'An unknown error occurred' };
    }
}