import { TokenPaymentForm } from '@/src/lib/components/token-payment-form'

export default function TokenPaymentPage() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Token-Based Payments</h1>
                    <p className="text-lg text-muted-foreground">
                        Process payments directly with Stripe Elements
                    </p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">How it works:</h2>
                        <ul className="space-y-2 text-sm">
                            <li>• Card details collected directly on your site</li>
                            <li>• Payment method created with Stripe Elements</li>
                            <li>• Payment processed using Payment Intents API</li>
                            <li>• Handles 3D Secure authentication automatically</li>
                            <li>• No redirect to external payment pages</li>
                        </ul>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-900">Test Cards:</h3>
                            <div className="text-sm text-blue-700 mt-2 space-y-1">
                                <div>Success: 4242 4242 4242 4242</div>
                                <div>Declined: 4000 0000 0000 0002</div>
                                <div>3D Secure: 4000 0027 6000 3184</div>
                            </div>
                            <p className="text-xs text-blue-600 mt-2">
                                Use any future date for expiry and any 3 digits for CVC
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <TokenPaymentForm />
                    </div>
                </div>
            </div>
        </div>
    )
} 