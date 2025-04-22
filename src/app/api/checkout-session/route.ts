import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripe = new Stripe(stripeSecretKey);

interface CheckoutRequestBody {
    clerkId: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as CheckoutRequestBody;
        const { clerkId } = body;

        console.log(`clerk id: ${clerkId}`)
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: 'price_1R7iY4P74SCuSPeLfB4MSpuy',
                quantity: 1
            }],
            mode: 'subscription',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/canceled`,
            subscription_data: {
                metadata: {
                    clerkId: clerkId
                }
            }
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}