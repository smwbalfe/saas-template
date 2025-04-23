import { useEffect, useState } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/lib/components/ui/card'
import { Progress } from '@/src/lib/components/ui/progress'
import { Button } from '@/src/lib/components/ui/button'
import { Badge } from '@/src/lib/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/lib/components/ui/avatar'
import { Activity, BarChart3, Bell, Settings, Shield, Users } from 'lucide-react'

export const PremiumPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkSubscription = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/')
                return
            }

            const { data: account } = await supabase
                .from('Account')
                .select('status')
                .eq('userId', user.id)
                .single()

            if (account?.status !== 'ACTIVE') {
                router.push('/')
                return
            }

            setIsLoading(false)
        }

        checkSubscription()
    }, [router])

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Premium Dashboard</h1>
                        <p className="text-muted-foreground mt-2 text-red-500">Welcome to your premium workspace</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-purple-500" />
                                Activity Overview
                            </CardTitle>
                            <CardDescription>Your recent activity and performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">Daily Usage</span>
                                        <span className="text-sm text-muted-foreground">75%</span>
                                    </div>
                                    <Progress value={75} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">Storage</span>
                                        <span className="text-sm text-muted-foreground">45%</span>
                                    </div>
                                    <Progress value={45} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-blue-500" />
                                Premium Features
                            </CardTitle>
                            <CardDescription>Access to exclusive features</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Shield className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="font-medium">Advanced Security</p>
                                        <p className="text-sm text-muted-foreground">Enterprise-grade protection</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-purple-500" />
                                    <div>
                                        <p className="font-medium">Team Collaboration</p>
                                        <p className="text-sm text-muted-foreground">Unlimited team members</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700">New</Badge>
                                Quick Actions
                            </CardTitle>
                            <CardDescription>Common tasks and shortcuts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Activity className="h-5 w-5" />
                                    <span>Analytics</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Users className="h-5 w-5" />
                                    <span>Team</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Settings className="h-5 w-5" />
                                    <span>Settings</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Shield className="h-5 w-5" />
                                    <span>Security</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
} 