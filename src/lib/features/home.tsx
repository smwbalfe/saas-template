"use client"

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabaseBrowserClient } from '@/src/lib/supabase/client'
import { useCheckout } from '@/src/lib/hooks/use-checkout'
import { useAuthListener } from '@/src/lib/hooks/use-auth-listener'
import { Button } from '@/src/lib/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/lib/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/lib/components/ui/avatar'
import { LogOut, Zap, Crown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/src/lib/components/ui/badge'

export const Home = () => {
    const { user } = useAuthListener()
    const { handleCheckout, isLoading } = useCheckout(user?.id)
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {
        if (user) {
            const checkSubscription = async () => {
                const { data: account } = await supabaseBrowserClient
                    .from('Account')
                    .select('status')
                    .eq('userId', user.id)
                    .single()
                setIsSubscribed(account?.status === 'ACTIVE')
            }
            checkSubscription()
        }
    }, [user])


    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-background text-text">
            {user ? (
                <Card className="max-w-md mx-auto bg-primary shadow-primary">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={user.user_metadata.avatar_url} />
                                <AvatarFallback>{user.user_metadata.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-heading font-primary">
                                        Welcome, {user.user_metadata.name}
                                    </CardTitle>
                                    {isSubscribed && (
                                        <Badge className="flex items-center gap-1 bg-accent text-text rounded-normal">
                                            <Crown className="h-3 w-3" />
                                            Premium
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription className="text-text text-subheading">
                                    {user.email}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!isSubscribed && (
                            <Button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className="w-full transition-all duration-200 bg-secondary text-text rounded-normal shadow-secondary"
                                size="lg"
                            >
                                <Zap className="mr-2 h-4 w-4" />
                                Subscribe Now
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => supabaseBrowserClient.auth.signOut()}
                            className="w-full border-accent text-text rounded-normal shadow-text"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="p-8 inline-block w-96 shadow-lg rounded-lg bg-white">
                            <Auth
                                supabaseClient={supabaseBrowserClient}
                                appearance={{
                                    theme: Su
                                }}
                                providers={['google']}
                            />
                        </div>
                    </div>
            )}
        </div>
    )
}