import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";


export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();
        const existingAccount = await prisma?.account.findUnique({
            where: { userId }
        });
        if (existingAccount) {
            return NextResponse.json({ success: true, message: "Account already exists" });
        }
        await prisma.account.create({
            data: {
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