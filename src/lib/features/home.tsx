"use client"

import { useCheckout } from "../hooks/use-checkout"
import { useAuthListener } from "../hooks/use-auth-listener"
import { Button } from "../components/ui/button"

export const Home = () => {
    const { user } = useAuthListener()
    const { handleCheckout, isLoading } = useCheckout(user?.id)

    return (
        <div className="flex flex-col items-center justify-center">
            <div>
                <Button onClick={handleCheckout} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Checkout'}
                </Button>
            </div>
        </div>
    )
}