import { prisma } from "@/src/lib/prisma";
import { sendWelcomeEmail } from "@/src/lib/actions/send-welcome-email";
import { createAdminClient } from "@/src/lib/supabase/server";

export async function createOrUpdateUserAccount(userId: string) {
    try {
        const account = await prisma.account.upsert({
            where: { userId },
            update: {},
            create: {
                userId
            }
        })

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
    } finally {
        await prisma.$disconnect()
    }
}
