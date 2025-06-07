import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { processEvent } from "@/src/lib/stripe/stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia'
});

export async function POST(req: Request) {
    const body = await req.text();
    
    const signature = headers().get("Stripe-Signature");

    if (!signature) {
        return NextResponse.json({}, { status: 400 });
    }

    async function doEventProcessing() {
        if (typeof signature !== "string") {
            throw new Error("[STRIPE HOOK] Header isn't a string???");
        }

        try {
            const event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
            const result = await processEvent(event);
            return result;
        } catch (error) {
            throw error;
        }
    }

    const response = NextResponse.json({ received: true });
    const processingPromise = doEventProcessing();
    processingPromise.catch(() => {});
    return response;
}
