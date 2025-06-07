import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/lib/components/ui/form"
import useLoginForm from "../hooks/use-login-form"
import { AuthAlert, FormDivider, SocialAuthButton } from "../components"

type LoginFormProps = {
    onSwitchMode: (mode: "login" | "reset" | "signup") => void
    googleText?: string
    loginText?: string
    redirectTo?: string
}

export function LoginForm({ onSwitchMode, googleText = "Log in with Google", loginText = "Log in", redirectTo = "/" }: LoginFormProps) {
    const { form, loading, serverError, handleEmailLogin, handleGoogleLogin } = useLoginForm(redirectTo)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-4">
                <AuthAlert message={serverError} type="error" />
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
                            <FormMessage className="text-red-500" />
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
                                    placeholder="Enter your password"
                                    type="password"
                                    {...field}
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={() => onSwitchMode("reset")}
                        className="text-sm text-primary hover:underline"
                    >
                        Forgot password?
                    </button>
                </div>
                <Button type="submit" className="w-full bg-gray-200 hover:bg-gray-500" disabled={loading}>
                    {loading ? "Loading..." : loginText}
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