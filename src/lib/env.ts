const env = {
    NODE_ENV: process.env.NODE_ENV!,
    
    NEXT_PUBLIC_APP_URL: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'https://dash.shrillecho.app',
    
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    
    DATABASE_URL: process.env.DATABASE_URL!,
    
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL!,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN!,
    
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    RESEND_FROM: process.env.RESEND_FROM!,
}

export default env;