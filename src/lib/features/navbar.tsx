"use client"

import { supabaseBrowserClient } from '@/src/lib/supabase/client'
import { useCheckout } from '@/src/lib/hooks/use-checkout'
import { useAuthListener } from '@/src/lib/hooks/use-auth-listener'
import { Button } from '@/src/lib/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/lib/components/ui/avatar'
import { LogOut, Zap, Crown, CircleX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/src/lib/components/ui/badge'
import { deleteCurrentUser } from '../actions/delete-users'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/src/lib/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

export const Navbar = () => {
    const { user } = useAuthListener()
    const { handleCheckout, isLoading } = useCheckout(user?.id)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const router = useRouter()

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

    const handleSignOut = async () =>  {
        await supabaseBrowserClient.auth.signOut() 
        router.push('/auth')
    }

    const handleDeleteAccount = async () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            await supabaseBrowserClient.auth.signOut()
            await deleteCurrentUser(user?.id!)
        }
    }

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <span className="font-bold text-xl text-gray-800">Dashboard</span>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {!isSubscribed && (
                                <Button
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                    className="transition-all duration-200 bg-gray-800 hover:bg-gray-900 text-white rounded-normal shadow-primary"
                                    size="sm"
                                >
                                    <Zap className="mr-1 h-4 w-4" />
                                    Upgrade to Premium
                                </Button>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 border border-gray-300">
                                            <AvatarImage src={user.user_metadata.avatar_url} />
                                            <AvatarFallback className="bg-gray-200 text-gray-700">{user.user_metadata.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium text-gray-700">{user.user_metadata.name}</span>
                                        {isSubscribed && (
                                            <Badge className="flex items-center gap-1 bg-gray-700 text-white rounded-normal">
                                                <Crown className="h-3 w-3" />
                                                Premium
                                            </Badge>
                                        )}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-2 py-1.5 text-sm text-gray-600">{user.email}</div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign Out</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDeleteAccount} className="text-red-500 cursor-pointer">
                                        <CircleX className="mr-2 h-4 w-4" />
                                        <span>Delete Account</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Button
                            asChild
                            className="bg-gray-800 hover:bg-gray-900 text-white rounded-normal shadow-primary"
                        >
                            <a href="/auth">Sign In</a>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}