
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prisma } from "@/src/lib/prisma";
import { sendWelcomeEmail } from "./actions/email";
import { createAdminClient } from "@/src/lib/supabase/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

