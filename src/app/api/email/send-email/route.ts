import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { Email } from '@/src/lib/emails/email';
import WelcomeEmail from '@/src/lib/emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRequestBody {
    to: string | string[];
    subject: string;
    html: string;
}

export async function POST(request: NextRequest) {

    const { to, subject, html }: EmailRequestBody = await request.json();
    
    try {
        const data = await resend.emails.send({
            from: 'simon@shrillecho.app',
            to: 'sbalfedev@gmail.com',
            subject: 'Test Email',
            react: WelcomeEmail({ name: 'simon' })
        });

        console.log(data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unknown error occurred' },
            { status: 500 }
        );
    }
}