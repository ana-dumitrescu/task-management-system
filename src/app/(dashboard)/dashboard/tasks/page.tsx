import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreateTaskForm } from "./create-task-form"

export default async function TasksPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-sm">
        <CreateTaskForm />
      </div>

      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        <div className="rounded-lg border">
          <div className="px-6 py-4 text-center text-gray-500">
            No tasks yet. Create your first task above.
          </div>
        </div>
      </div>
    </div>
  )
}