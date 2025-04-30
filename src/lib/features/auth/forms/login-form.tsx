import { FcGoogle } from "react-icons/fc"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/lib/components/ui/form"
import { Alert, AlertDescription } from "@/src/lib/components/ui/alert"
import { AlertCircle } from "lucide-react"
import useLoginForm from "../hooks/use-login-form"

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
                {serverError && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{serverError}</AlertDescription>
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
                <Button type="submit" className="w-full" disabled={loading}>
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
            </form>
        </Form>
    )
}