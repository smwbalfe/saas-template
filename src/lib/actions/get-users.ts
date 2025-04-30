'use server'
import { createAdminClient } from '@/src/lib/supabase/server';

export async function getAllUsers() {
    const supabase = await createAdminClient()
    const { data, error } = await supabase.auth.admin.listUsers()
    if (error) throw error
    return data
}