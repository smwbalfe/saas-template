import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRequestBody {
    to: string | string[];
    subject: string;
    html: string;
}

export async function POST(request: NextRequest) {
    try {
        const { to, subject, html }: EmailRequestBody = await request.json();
        const data = await resend.emails.send({
            from: 'simon@shrillecho.app',
            to: 'sbalfedev@gmail.com',
            subject,
            html,
            attachments: [
                {
                    path: 'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*',
                    filename: 'dog.jpg',
                },
            ],
        });
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unknown error occurred' },
            { status: 500 }
        );
    }
}