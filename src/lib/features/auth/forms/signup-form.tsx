import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/lib/components/ui/form"
import { useSignupForm } from "../hooks/use-signup-form"
import { AuthAlert, FormDivider, SocialAuthButton } from "../components"

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
                <AuthAlert message={serverError} type="error" />
                <AuthAlert message={successMessage} type="success" />
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
                <Button variant="default" type="submit" className="w-full text-white " disabled={loading}>
                    {loading ? "Signing up..." : "Sign up"}
                </Button>
                <FormDivider />
                <SocialAuthButton
                    provider="google"
                    text={googleText}
                    onClick={handleGoogleLogin}
                    loading={loading}
                />
            </form>
        </Form>
    )
}