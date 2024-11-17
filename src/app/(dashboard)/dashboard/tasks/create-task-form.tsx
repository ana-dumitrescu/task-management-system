'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
})

type TaskValues = z.infer<typeof taskSchema>

export function CreateTaskForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "MEDIUM"
    }
  })

  const onSubmit = async (data: TaskValues) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccessMessage(null)
  
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create task')
      }
  
      reset()
      setSuccessMessage('Task created successfully!')
      router.refresh()
    } catch (error) {
      console.error('Task creation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to create task')
    } finally {
      setIsLoading(false)
    }
  }

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Task title"
          {...register("title")}
          error={errors.title?.message}
        />
      </div>

      <div>
        <textarea
          className="w-full rounded-md border p-2 text-sm"
          placeholder="Task description (optional)"
          rows={3}
          {...register("description")}
        />
      </div>

      <div>
        <select
          className="w-full rounded-md border p-2 text-sm"
          {...register("priority")}
        >
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {successMessage && (
        <div className="text-sm text-green-500">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  )
}