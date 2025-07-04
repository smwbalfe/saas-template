import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!
export const client = postgres("postgresql://postgres.mthcwmvkjaudqynbkmbd:ungpNZgMFjMz@aws-0-eu-west-2.pooler.supabase.com:5432/postgres", { prepare: false })
export const db = drizzle(client);