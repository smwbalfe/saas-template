import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/src/lib/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
    try {
        console.log("Stripe webhook received");
        const body = await request.text();
        const signature = request.headers.get("stripe-signature");

        if (!signature) {
            console.log("No Stripe signature found in request");
            return NextResponse.json({}, { status: 400 });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-02-24.acacia'
        });

        console.log(`Constructing Stripe event with signature: ${signature.substring(0, 10)}...`);
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret!
        );
        
        console.log(`Webhook event type: ${event.type}`);
        console.log(`Event ID: ${event.id}`);

        switch (event.type) {
            case "customer.subscription.created": {
                const subscription = event.data.object;
                console.log(`Subscription created: ${subscription.id}`);
                console.log(`Customer ID: ${subscription.customer}`);
                console.log(`User ID from metadata: ${subscription.metadata.userId}`);
                
                await prisma.account.upsert({
                    where: {
                        userId: subscription.metadata.userId,
                    },
                    update: {
                        status: "ACTIVE",
                        package: "MONTHLY_SUBSCRIPTION",
                        stripeCustomerId: subscription.customer as string,
                    },
                    create: {
                        userId: subscription.metadata.userId,
                        status: "ACTIVE",
                        package: "MONTHLY_SUBSCRIPTION",
                        stripeCustomerId: subscription.customer as string,
                    }
                });
                console.log(`Account updated for user ${subscription.metadata.userId} - status: ACTIVE`);
                break;
            }
            case "checkout.session.completed": {
                const payment = event.data.object;
                console.log(`Checkout session completed: ${payment.id}`);
                console.log(`Payment mode: ${payment.mode}`);
                
                if (payment.mode === "payment") {
                    console.log(`Processing one-time payment for user: ${payment.metadata!.userId}`);
                    await prisma.account.update({
                        where: {
                            userId: payment.metadata!.userId,
                        },
                        data: {
                            status: "ACTIVE",
                            package: "LIFETIME",
                        },
                    });
                    console.log(`Account updated for user ${payment.metadata!.userId} - package: LIFETIME`);
                } else {
                    console.log(`Checkout session was not a one-time payment, skipping account update`);
                }
                break;
            }
            case "customer.subscription.updated": {
                const subscription = event.data.object;
                console.log(`Subscription updated: ${subscription.id}`);
                console.log(`Cancel at period end: ${subscription.cancel_at_period_end}`);
                console.log(`User ID from metadata: ${subscription.metadata.userId}`);
                
                if (subscription.cancel_at_period_end) {
                    console.log(`Subscription marked for cancellation at period end`);
                    await prisma.account.update({
                        where: {
                            userId: subscription.metadata.userId,
                        },
                        data: {
                            status: "CANCELLED",
                        },
                    });
                    console.log(`Account updated for user ${subscription.metadata.userId} - status: CANCELLED`);
                } else {
                    console.log(`Subscription active or reactivated`);
                    await prisma.account.update({
                        where: {
                            userId: subscription.metadata.userId,
                        },
                        data: {
                            status: "ACTIVE",
                        },
                    });
                    console.log(`Account updated for user ${subscription.metadata.userId} - status: ACTIVE`);
                }
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                console.log(`Subscription deleted: ${subscription.id}`);
                console.log(`User ID from metadata: ${subscription.metadata.userId}`);
                
                await prisma.account.update({
                    where: {
                        userId: subscription.metadata.userId,
                    },
                    data: {
                        status: "INACTIVE",
                        package: null,
                        stripeCustomerId: null,
                    },
                });
                console.log(`Account updated for user ${subscription.metadata.userId} - status: INACTIVE, subscription data cleared`);
                break;
            }
            default: {
                console.log(`Unhandled event type: ${event.type}`);
            }
        }

        console.log("Webhook processed successfully");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error processing webhook:", error);
        if (error instanceof Stripe.errors.StripeError) {
            console.error(`Stripe error type: ${error.type}`);
            console.error(`Stripe error code: ${error.code}`);
        }
        return NextResponse.json(
            { success: false, error: error },
            { status: 500 }
        );
    }
}