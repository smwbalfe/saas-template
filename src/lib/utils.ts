 import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "@/src/lib/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function createOrUpdateUserAccount(userId: string) {
  try {
    await prisma.account.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        status: "INACTIVE"
      }
    })
  } catch (e) {
    console.error("Failed to create user account:", e)
  } finally {
    await prisma.$disconnect()
  }
}