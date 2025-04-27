'use server'
import { Resend } from 'resend';
import WelcomeEmail from '@/src/lib/emails/welcome';
import { prisma } from '@/src/lib/prisma'; // Add this import for Prisma client
const resend = new Resend(process.env.RESEND_API_KEY);

import { createClient } from '@/src/lib/supabase/server';

export type EmailData = {
    email: string;
    name: string;
    userId: string;
}

export async function sendEmail(emailData: EmailData) {
    const { email, name, userId } = emailData;
    try {
        const account = await prisma.account.findFirst({
            where: { userId }
        });

        if (!account) {
            return { success: false, error: 'Account not found' };
        }

        if (account.welcomeEmailSent) {
            console.log("Welcome email already sent to", email);
            return { success: true, data: null, alreadySent: true };
        }
        
        const data = await resend.emails.send({
            from: 'simon@shrillecho.app',
            to: email,
            subject: 'Welcome to Our Platform',
            react: WelcomeEmail({ name })
        });
        await prisma.account.update({
            where: { id: account.id },
            data: { welcomeEmailSent: true }
        });

        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}