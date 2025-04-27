'use server'
import { createAdminClient } from '@/src/lib/supabase/server';
import { cookies } from 'next/headers'

export async function deleteCurrentUser(userId: string) {
    const supabase = await createAdminClient()

    const cookieStore = cookies()

    for (const cookie of cookieStore.getAll()) {
        console.log("cookie", cookie)
    }
    const { data, error } = await supabase.auth.admin.deleteUser(userId)
    console.log("data", data)
    console.log("error", error)
    return { success: true }
}