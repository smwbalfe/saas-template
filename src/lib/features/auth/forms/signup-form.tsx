import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/lib/components/ui/form"
import { Alert, AlertDescription } from "@/src/lib/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useSignupForm } from "../hooks/use-signup-form"


type SignupFormProps = {
    onSwitchMode: (mode: "login" | "reset" | "signup") => void
    googleText?: string
    redirectTo?: string
    redirectToSignup?: string
}


export function SignupForm({ onSwitchMode, googleText = "Sign up with Google", redirectTo = "/api/auth/callback", redirectToSignup = "/" }: SignupFormProps) {
    const { form, loading, serverError, handleSignUp, handleGoogleLogin, successMessage } = useSignupForm(redirectTo, redirectToSignup)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                {serverError && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                )}
                {successMessage && (
                    <Alert variant="default" className="mb-4 text-green-500">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    {...field}
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Create a password"
                                    type="password"
                                    {...field}
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Confirm your password"
                                    type="password"
                                    {...field}
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
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
            </form>
        </Form>
    )
}