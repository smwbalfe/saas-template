import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();
        
        await prisma.account.upsert({
            where: {
                userId: userId,
            },
            update: {},
            create: {
                userId: userId,
                status: "INACTIVE",
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "Failed to create account" },
            { status: 500 }
        );
    }
} 