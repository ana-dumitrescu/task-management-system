'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Input } from "@/components/ui/input"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterValues) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('Sending registration data:', {
        name: data.name,
        email: data.email,
        passwordLength: data.password.length
      })

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      console.log('Response status:', response.status)
      const responseText = await response.text()
      console.log('Response text:', responseText)

      let result
      try {
        result = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse JSON:', responseText)
        throw new Error('Invalid server response')
      }

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      console.log('Registration successful:', result)
      router.push('/login?registered=true')
    } catch (error) {
      console.error('Registration error:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to register. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              id="name"
              type="text"
              placeholder="Full name"
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password")}
              error={errors.password?.message}
            />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
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
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-center text-sm">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}