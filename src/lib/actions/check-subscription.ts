"use server"
import { prisma } from '../prisma'
import { createClient } from '../supabase/server'

export async function checkSubscription() {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()
    if (!user) {
        return { isSubscribed: false }
    }
    const account = await prisma.account.findUnique({
        where: {
            userId: user.id
        },
        select: {
            status: true
        }
    })
    return { isSubscribed: account?.status === 'ACTIVE' }
}