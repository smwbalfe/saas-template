import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/src/lib/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
    try {

        const body = await request.text();
        const signature = request.headers.get("stripe-signature");

        if (!signature) {
            return NextResponse.json(
                { error: "Missing stripe-signature header" },
                { status: 400 }
            );
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-02-24.acacia'
        });

        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret!
        );

        switch (event.type) {
            case "customer.subscription.created": {
                const subscription = event.data.object;
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
                break;
            }
            case "checkout.session.completed": {
                const payment = event.data.object;
                if (payment.mode === "payment") {
                    await prisma.account.update({
                        where: {
                            userId: payment.metadata!.userId,
                        },
                        data: {
                            status: "ACTIVE",
                            package: "LIFETIME",
                        },
                    });
                }
                break;
            }
            case "customer.subscription.updated": {
                const subscription = event.data.object;
                if (subscription.cancel_at_period_end) {
                    await prisma.account.update({
                        where: {
                            userId: subscription.metadata.userId,
                        },
                        data: {
                            status: "CANCELLED",
                        },
                    });
                } else {
                    await prisma.account.update({
                        where: {
                            userId: subscription.metadata.userId,
                        },
                        data: {
                            status: "ACTIVE",
                        },
                    });
                }
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
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
                break;
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}