import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/lib/components/ui/card'
import { Progress } from '@/src/lib/components/ui/progress'
import { Button } from '@/src/lib/components/ui/button'
import { Badge } from '@/src/lib/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/lib/components/ui/avatar'
import { Activity, BarChart3, Bell, Settings, Shield, Users, Zap, ArrowUpRight, ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/lib/components/ui/tabs'
import { Separator } from '@/src/lib/components/ui/separator'
import { useAuthListener } from '@/src/lib/hooks/use-auth-listener'
import { useEffect, useState } from 'react'
import { client } from '@/src/lib/supabase/client'

export const PremiumPage = () => {
    const { user } = useAuthListener()
    const [usageData, setUsageData] = useState({
        dailyUsage: 75,
        storage: 45,
        totalUsage: 1239,
        activeUsers: 89,
        storageUsed: 45
    })

    if (!user) return null
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">Premium Dashboard</h1>
                        <p className="mt-3 text-lg text-muted-foreground">Welcome back, {user.user_metadata.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="hover:bg-purple-100 dark:hover:bg-purple-900/50">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-purple-100 dark:hover:bg-purple-900/50">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Avatar className="border-2 border-purple-200 dark:border-purple-800">
                            <AvatarImage src={user.user_metadata.avatar_url} />
                            <AvatarFallback>{user.user_metadata.name?.[0]}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <Activity className="h-6 w-6 text-purple-500" />
                                        Activity Overview
                                    </CardTitle>
                                    <CardDescription className="text-base">Your recent activity and performance</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-base font-semibold">Daily Usage</span>
                                                <span className="text-base text-muted-foreground">{usageData.dailyUsage}%</span>
                                            </div>
                                            <Progress value={usageData.dailyUsage} className="h-2 bg-purple-100 dark:bg-purple-900/50" />
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-base font-semibold">Storage</span>
                                                <span className="text-base text-muted-foreground">{usageData.storage}%</span>
                                            </div>
                                            <Progress value={usageData.storage} className="h-2 bg-purple-100 dark:bg-purple-900/50" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <Zap className="h-6 w-6 text-blue-500" />
                                        Premium Features
                                    </CardTitle>
                                    <CardDescription className="text-base">Access to exclusive features</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors">
                                            <Shield className="h-6 w-6 text-green-500" />
                                            <div>
                                                <p className="text-lg font-semibold">Advanced Security</p>
                                                <p className="text-sm text-muted-foreground">Enterprise-grade protection</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors">
                                            <Users className="h-6 w-6 text-purple-500" />
                                            <div>
                                                <p className="text-lg font-semibold">Team Collaboration</p>
                                                <p className="text-sm text-muted-foreground">Unlimited team members</p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400 text-sm">New</Badge>
                                        Quick Actions
                                    </CardTitle>
                                    <CardDescription className="text-base">Common tasks and shortcuts</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/50">
                                            <Activity className="h-6 w-6" />
                                            <span className="text-base">Analytics</span>
                                        </Button>
                                        <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/50">
                                            <Users className="h-6 w-6" />
                                            <span className="text-base">Team</span>
                                        </Button>
                                        <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/50">
                                            <Settings className="h-6 w-6" />
                                            <span className="text-base">Settings</span>
                                        </Button>
                                        <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/50">
                                            <Shield className="h-6 w-6" />
                                            <span className="text-base">Security</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl">
                                    <BarChart3 className="h-6 w-6 text-purple-500" />
                                    Performance Metrics
                                </CardTitle>
                                <CardDescription className="text-base">Track your premium account performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold">Total Usage</span>
                                            <ArrowUpRight className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="text-3xl font-bold mt-2">{usageData.totalUsage}</p>
                                        <p className="text-sm text-muted-foreground">+12% from last month</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold">Active Users</span>
                                            <ArrowUpRight className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="text-3xl font-bold mt-2">{usageData.activeUsers}</p>
                                        <p className="text-sm text-muted-foreground">+5% from last week</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold">Storage Used</span>
                                            <ArrowUpRight className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="text-3xl font-bold mt-2">{usageData.storageUsed}%</p>
                                        <p className="text-sm text-muted-foreground">+3% from yesterday</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
} 