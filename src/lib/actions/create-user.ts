import { db } from "@/src/lib/db"
import { accounts } from "@/src/lib/db/schema"
import { sendWelcomeEmail } from "@/src/lib/actions/send-welcome-email"
import { createAdminClient } from "@/src/lib/supabase/server"
import { eq } from "drizzle-orm"

export async function createOrUpdateUserAccount(userId: string) {
    try {
        await db.insert(accounts)
            .values({ userId })
            .onConflictDoUpdate({
                target: accounts.userId,
                set: { updatedAt: new Date() }
            })

        const [account] = await db.select()
            .from(accounts)
            .where(eq(accounts.userId, userId))
            .limit(1)

        if (!account) {
            throw new Error(`Account not found for userId: ${userId}`)
        }

        if (account.welcomeEmailSent) {
            return
        }

        const supabase = await createAdminClient()
        const { data: { user }, error } = await supabase.auth.admin.getUserById(userId)

        if (error) {
            throw new Error(`Failed to fetch user: ${error.message}`)
        }

        if (!user) {
            throw new Error(`User not found in Supabase: ${userId}`)
        }

        await sendWelcomeEmail({
            email: user.email!,
            name: user.user_metadata?.name || 'there',
            userId: userId
        })
    } catch (e) {
        console.error("Failed to create user account:", e)
        throw e
    }
}
