const env = {
    NEXT_PUBLIC_APP_URL: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'https://dash.shrillecho.app'
}

export default env;

