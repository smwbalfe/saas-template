"use client"
import { useState } from "react"
import { Alert, AlertDescription } from "@/src/lib/components/ui/alert"
import { LoginForm } from "@/src/lib/features/auth/forms/login-form"
import { ResetForm } from "@/src/lib/features/auth/forms/reset-form"
import { SignupForm } from "@/src/lib/features/auth/forms/signup-form"
import { CheckCircleIcon } from "lucide-react"


interface AuthProps {
    heading?: string
    subheading?: string
    logo: {
        url: string
        src: string
        alt: string
    }
    loginText?: string
    googleText?: string
    signupText?: string
    redirectTo?: string
    redirectToSignup?: string
}

export const AuthScreen = ({
    heading = "Login",
    subheading = "Welcome back",
    logo = {
        url: "https://www.shadcnblocks.com",
        src: "https://shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
        alt: "Shadcnblocks",
    },
    loginText = "Log in",
    googleText = "Log in with Google",
    signupText = "Don't have an account?",
    redirectTo = "/api/auth/callback",
    redirectToSignup = "/",
}: AuthProps) => {
    const [mode, setMode] = useState<"login" | "reset" | "signup">("login")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const switchMode = (newMode: "login" | "reset" | "signup") => {
        setMode(newMode)
        setError("")
        setMessage("")
    }

    return (
        <section className="flex items-center justify-center min-h-screen py-32 ">
            <div className="container flex items-center justify-center">
                <div className="w-full max-w-sm p-6 rounded">
                    <div className="mb-6 flex flex-col items-center">
                        <a href={logo.url} className="mb-6 flex items-center gap-2">
                            <img src={logo.src} className="max-h-8" alt={logo.alt} />
                        </a>
                        <h1 className="mb-2 text-2xl font-bold">
                            {mode === "login" ? heading : mode === "signup" ? "Sign Up" : "Reset Password"}
                        </h1>
                        <p className="text-muted-foreground">
                            {mode === "login" ? subheading : mode === "signup" ? "Create your account" : "Recover your password"}
                        </p>
                    </div>

                    {message && (
                        <Alert className="mb-4 bg-green-50 border border-green-200 text-green-700">
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert className="mb-4 bg-red-50 border border-red-200 text-red-700" variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {mode === "login" && (
                        <LoginForm
                            onSwitchMode={switchMode}
                            googleText={googleText}
                            loginText={loginText}
                            redirectTo={redirectTo}
                        />
                    )}

                    {mode === "signup" && (
                        <SignupForm
                            onSwitchMode={switchMode}
                            googleText={googleText}
                            redirectTo={redirectTo}
                            redirectToSignup={redirectToSignup}
                        />
                    )}

                    {mode === "reset" && (
                        <ResetForm onSwitchMode={switchMode} />
                    )}

                    {mode === "login" && (
                        <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                            <p>{signupText}</p>
                            <button
                                type="button"
                                onClick={() => switchMode("signup")}
                                className="font-medium text-primary"
                            >
                                Sign up
                            </button>
                        </div>
                    )}

                    {mode === "signup" && (
                        <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                            <p>Already have an account?</p>
                            <button
                                type="button"
                                onClick={() => switchMode("login")}
                                className="font-medium text-primary"
                            >
                                Log in
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export const Auth = () => {
    return (
        <AuthScreen logo={{
            url: "https://www.shadcnblocks.com",
            src: "https://shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
            alt: "Shadcnblocks"
        }} />   
    )
}

export default Auth