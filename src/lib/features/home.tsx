"use client"

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { client } from '@/src/lib/supabase/client'
import { useCheckout } from '@/src/lib/hooks/use-checkout'
import { useAuthListener } from '@/src/lib/hooks/use-auth-listener'
import { Button } from '@/src/lib/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/lib/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/lib/components/ui/avatar'
import { LogOut, Zap, Moon, Sun, Crown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Badge } from '@/src/lib/components/ui/badge'

export const Home = () => {
    const { user } = useAuthListener()
    const { handleCheckout, isLoading } = useCheckout(user?.id)
    const { theme, setTheme } = useTheme()
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {
        if (user) {
            const checkSubscription = async () => {
                const { data: account } = await client
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
        <div className="container mx-auto px-4 py-8 min-h-screen bg-background">
            <div className="absolute top-4 right-4">
                <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="hover:bg-muted"
                >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
            </div>
            {user ? (
                <Card className="max-w-md mx-auto bg-card">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={user.user_metadata.avatar_url} />
                                <AvatarFallback>{user.user_metadata.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle>Welcome, {user.user_metadata.name}</CardTitle>
                                    {isSubscribed && (
                                        <Badge variant="secondary" className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                            <Crown className="h-3 w-3" />
                                            Premium
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription>{user.email}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!isSubscribed && (
                            <Button 
                                onClick={handleCheckout} 
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-200"
                                size="lg"
                            >
                                <Zap className="mr-2 h-4 w-4" />
                                Subscribe Now
                            </Button>
                        )}
                        <Button 
                            variant="outline" 
                            onClick={() => client.auth.signOut()}
                            className="w-full"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="max-w-md mx-auto bg-card">
                    <CardHeader>
                        <CardTitle>Welcome</CardTitle>
                        <CardDescription>Sign in to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Auth
                            supabaseClient={client}
                            appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                        colors: {
                                            brand: 'hsl(var(--primary))',
                                            brandAccent: 'hsl(var(--primary))',
                                            inputBackground: 'hsl(var(--background))',
                                            inputBorder: 'hsl(var(--border))',
                                            inputText: 'hsl(var(--foreground))',
                                            messageText: 'hsl(var(--foreground))',
                                            messageBackground: 'hsl(var(--muted))',
                                        }
                                    }
                                }
                            }}
                            providers={['google']}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}