import { db } from "@/src/lib/db"
import { accounts } from "@/src/lib/db/schema"
import { sendWelcomeEmail } from "@/src/lib/actions/send-welcome-email"
import { createAdminClient } from "@/src/lib/supabase/server"
import { eq } from "drizzle-orm"

export async function createOrUpdateUserAccount(userId: string) {
    try {
        const [account] = await db.insert(accounts)
            .values({ userId })
            .onConflictDoUpdate({
                target: accounts.userId,
                set: { updatedAt: new Date() }
            })
            .returning()

        const supabase = await createAdminClient()
        const { data: { user } } = await supabase.auth.admin.getUserById(userId)

        if (user && !account.welcomeEmailSent) {
            await sendWelcomeEmail({
                email: user.email!,
                name: user.user_metadata?.name || 'there',
                userId: userId
            })
        }
    } catch (e) {
        console.error("Failed to create user account:", e)
    }
}
