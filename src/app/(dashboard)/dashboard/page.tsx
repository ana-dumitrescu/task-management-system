import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  // const session = await auth()

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-blue-900">0</p>
        </div>
        
        <div className="rounded-lg bg-green-50 p-6">
          <h3 className="font-semibold text-green-900">Completed Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-green-900">0</p>
        </div>
        
        <div className="rounded-lg bg-purple-50 p-6">
          <h3 className="font-semibold text-purple-900">In Progress</h3>
          <p className="mt-2 text-3xl font-bold text-purple-900">0</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Tasks</h3>
        <div className="rounded-lg border">
          <div className="px-6 py-4 text-center text-gray-500">
            No tasks yet. Click &quot;Tasks&quot; to get started.
          </div>
        </div>
      </div>
    </div>
  )
}