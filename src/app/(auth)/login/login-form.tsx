'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginValues) => {
    try {
      setIsLoading(true)
      setError(null)

      const callbackUrl = searchParams?.get("from") || "/dashboard"
      
      const result = await signIn("credentials", {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      }

      // Wait a bit before redirecting to ensure session is properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Input
          id="email"
          type="email"
          placeholder="Email address"
          {...register("email")}
          error={errors.email?.message}
          disabled={isLoading}
        />
        <Input
          id="password"
          type="password"
          placeholder="Password"
          {...register("password")}
          error={errors.password?.message}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-center text-sm text-red-500">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="text-center text-sm">
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Don&apos;t have an account? Register
        </Link>
      </div>
    </form>
  )
}