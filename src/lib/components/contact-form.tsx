'use client';
import { useState, FormEvent } from 'react';

interface EmailRequestBody {
    to: string | string[];
    subject: string;
    html: string;
}

interface EmailResponse {
    id?: string;
    error?: string;
}

export default function EmailForm() {
    const [to, setTo] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [html, setHtml] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        const requestBody: EmailRequestBody = {
            to,
            subject,
            html
        };

        try {
            const response = await fetch('/api/email/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data: EmailResponse = await response.json();

            if (response.ok && data.id) {
                setResult({
                    success: true,
                    message: `Email sent successfully! ID: ${data.id}`
                });
                setTo('');
                setSubject('');
                setHtml('');
            } else {
                setResult({
                    success: false,
                    message: data.error || 'Failed to send email'
                });
            }
        } catch (error) {
            setResult({
                success: false,
                message: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Send Email</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="to" className="block mb-1">To:</label>
                    <input
                        id="to"
                        type="email"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="subject" className="block mb-1">Subject:</label>
                    <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="html" className="block mb-1">HTML Content:</label>
                    <textarea
                        id="html"
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        className="w-full p-2 border rounded h-32"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {isLoading ? 'Sending...' : 'Send Email'}
                </button>
            </form>

            {result && (
                <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                    {result.message}
                </div>
            )}
        </div>
    );
}