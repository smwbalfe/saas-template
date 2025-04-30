import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/src/lib/components/ui/button"
import { Input } from "@/src/lib/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/lib/components/ui/form"
import { Alert, AlertDescription } from "@/src/lib/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { usePasswordReset } from "../hooks/use-password-reset"
import { resetSchema } from "./schema"
import { useState } from "react"


type ResetFormProps = {
    onSwitchMode: (mode: "login" | "reset" | "signup") => void
}

export function ResetForm({ onSwitchMode }: ResetFormProps) {
    const { loading, serverError, successMessage,  handlePasswordReset } = usePasswordReset()

    
    const form = useForm<z.infer<typeof resetSchema>>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof resetSchema>) => {
        const result = await handlePasswordReset(values)
        if (result.success) {
            form.reset()
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                    <Alert variant="destructive" className="mb-4 text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                )}
                {successMessage && (
                    <Alert variant="default" className="mb-4 text-green-700 font-medium shadow-accent">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}
                <p className="text-sm text-muted-foreground">
                    Enter your email address below and we'll send you a link to reset your password.
                </p>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    {...field}
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => onSwitchMode("login")}
                    disabled={loading}
                >
                    Back to Login
                </Button>
            </form>
        </Form>
    )
} 