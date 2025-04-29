"use client"
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

import { Button } from "@/src/lib/components/ui/button";
import { Checkbox } from "@/src/lib/components/ui/checkbox";
import { Input } from "@/src/lib/components/ui/input";
import { supabaseBrowserClient } from "@/src/lib/supabase/client";
import { useRouter } from "next/navigation";

interface LoginProps {
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
    signupUrl?: string
    redirectTo?: string
    redirectToSignup?: string
}

function LoginComponent({
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
    signupUrl = "#",
    redirectTo = "/api/auth/callback",
    redirectToSignup = "/",
}: LoginProps) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [mode, setMode] = useState("login"); // login, reset, signup
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setResetEmail("");
        setError("");
        setMessage("");
    };
    const switchMode = (newMode: string) => {
        resetForm();
        setMode(newMode);
    };
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabaseBrowserClient.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            router.push('/');
        } catch (error: any) {
            console.log(error);
            setError(error.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabaseBrowserClient.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}${redirectToSignup}`
                }
            });

            if (error) throw error;

            setMessage("Registration successful! Please check your email to verify your account.");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (error: any) {
            console.log(error);
            setError(error.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const { error } = await supabaseBrowserClient.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;
            setMessage("Password reset email sent. Please check your inbox.");
            setResetEmail("");

        } catch (error: any) {
            console.log(error);
            setError(error.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabaseBrowserClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}${redirectTo}`
                }
            });

            if (error) throw error;
        } catch (error: any) {
            console.log(error);
            setLoading(false);
        }
    };

    const renderForm = () => {
        if (mode === "reset") {
            return (
                <form onSubmit={handlePasswordReset}>
                    <div className="grid gap-4">
                        <p className="text-sm text-muted-foreground">
                            Enter your email address below and we'll send you a link to reset your password.
                        </p>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => switchMode("login")}
                            disabled={loading}
                        >
                            Back to Login
                        </Button>
                    </div>
                </form>
            );
        } else if (mode === "signup") {
            return (
                <form onSubmit={handleSignUp}>
                    <div className="grid gap-4">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <Input
                            type="password"
                            placeholder="Create a password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <Input
                            type="password"
                            placeholder="Confirm your password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" className="mt-2 w-full" disabled={loading}>
                            {loading ? "Signing up..." : "Sign up"}
                        </Button>
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <FcGoogle className="mr-2 size-5" />
                            {googleText}
                        </Button>
                    </div>
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
                </form>
            );
        } else {
            // Default login form
            return (
                <form onSubmit={handleEmailLogin}>
                    <div className="grid gap-4">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <div>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    className="border-muted-foreground"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Remember me
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    switchMode("reset");
                                }}
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <Button type="submit" className="mt-2 w-full" disabled={loading}>
                            {loading ? "Loading..." : loginText}
                        </Button>
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <FcGoogle className="mr-2 size-5" />
                            {googleText}
                        </Button>
                    </div>
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
                </form>
            );
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen py-32">
            <div className="container flex items-center justify-center">
                <div className="w-full max-w-sm rounded-md p-6 shadow">
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
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {renderForm()}
                </div>
            </div>
        </section>
    );
}

export default function Auth() {
    return <LoginComponent logo={{
        url: "https://www.shadcnblocks.com",
        src: "https://shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
        alt: "Shadcnblocks"
    }} />
}