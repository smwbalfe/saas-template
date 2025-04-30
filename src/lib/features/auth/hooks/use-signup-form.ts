import { supabaseBrowserClient } from "@/src/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signupSchema } from "../forms/schema"

export function useSignupForm(redirectTo: string, redirectToSignup: string) {
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const handleSignUp = async (values: z.infer<typeof signupSchema>) => {
        setLoading(true)
        setServerError("")
        try {
            const { error } = await supabaseBrowserClient.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    emailRedirectTo: `${window.location.origin}${redirectToSignup}`
                }
            })
            if (error) throw error
            form.reset()
            setSuccessMessage("Sign up successful. Please check your email for verification.")
           
        } catch (error: any) {
            setServerError(error.message || "Failed to sign up. Please try again.")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        setServerError("")
        try {
            const { error } = await supabaseBrowserClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}${redirectTo}`
                }
            })
            if (error) throw error
        } catch (error: any) {
            setServerError(error.message || "Failed to sign up with Google. Please try again.")
            console.log(error)
            setLoading(false)
        }
    }

    return {
        form,
        loading,
        serverError,
        handleSignUp,
        handleGoogleLogin,
        successMessage
    }
}