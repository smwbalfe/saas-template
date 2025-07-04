'use client'
import { useState } from 'react'
import { CardElement, Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { useTokenPayment } from '../hooks/use-token-payment'
import env from '../env'

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    },
}

const PaymentFormContent = () => {
    const [amount, setAmount] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const { processPayment, isLoading, error, clearError } = useTokenPayment()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError()
        
        const numAmount = parseFloat(amount)
        if (!numAmount || numAmount <= 0) {
            return
        }

        const result = await processPayment(numAmount, description || undefined)
        if (result.success) {
            alert(`Payment successful! Amount: $${result.amount}`)
            setAmount('')
            setDescription('')
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Token Payment</CardTitle>
                <CardDescription>
                    Pay securely with your credit card
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="10.00"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description (optional)</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this payment for?"
                        />
                    </div>

                    <div>
                        <Label>Card Details</Label>
                        <div className="mt-1 p-3 border border-gray-300 rounded-md">
                            <CardElement options={CARD_ELEMENT_OPTIONS} />
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button 
                        type="submit" 
                        disabled={isLoading || !amount} 
                        className="w-full"
                    >
                        {isLoading ? 'Processing...' : `Pay $${amount || '0.00'}`}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export const TokenPaymentForm = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentFormContent />
        </Elements>
    )
} 