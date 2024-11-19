// app/dashboard/page.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TaskList } from "@/components/task-list"

async function getTaskStats(userId: string) {
  const tasks = await prisma.task.findMany({
    where: { assigneeId: userId },
  });

  return {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'DONE').length,
    inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
    review: tasks.filter(task => task.status === 'REVIEW').length,
    urgent: tasks.filter(task => task.priority === 'URGENT').length,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const stats = await getTaskStats(session.user.id);
  
  const tasks = await prisma.task.findMany({
    where: { assigneeId: session.user.id },
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' }
    ],
    take: 5
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-blue-900">{stats.total}</p>
        </div>
        
        <div className="rounded-lg bg-green-50 p-6">
          <h3 className="font-semibold text-green-900">Completed</h3>
          <p className="mt-2 text-3xl font-bold text-green-900">{stats.completed}</p>
        </div>
        
        <div className="rounded-lg bg-purple-50 p-6">
          <h3 className="font-semibold text-purple-900">In Progress</h3>
          <p className="mt-2 text-3xl font-bold text-purple-900">{stats.inProgress}</p>
        </div>

        <div className="rounded-lg bg-red-50 p-6">
          <h3 className="font-semibold text-red-900">Urgent Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-red-900">{stats.urgent}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Recent Tasks</h3>
        {tasks.length > 0 ? (
          <TaskList initialTasks={tasks} />
        ) : (
          <div className="rounded-lg border">
            <div className="px-6 py-4 text-center text-gray-500">
              No tasks yet. Click "Tasks" to get started.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}