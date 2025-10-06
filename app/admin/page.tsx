"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useAdminStats } from "@/lib/hooks/use-admin-stats"
import { useBranches } from "@/lib/hooks/use-branches"
import { StatsCard } from "@/components/admin/stats-card"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { RecentAppointmentsTable } from "@/components/admin/recent-appointments-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, DollarSign, Users, Clock } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedBranch, setSelectedBranch] = useState<string>("all")

  const { branches } = useBranches()
  const { stats, recentAppointments, revenueByMonth, isLoading } = useAdminStats(selectedBranch || undefined)

  // Redirect if not admin
  if (!authLoading && user?.role !== "admin") {
    router.push("/")
    return null
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your salon business</p>
        </div>
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches?.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Appointments"
          value={stats?.totalAppointments || 0}
          icon={Calendar}
          description="All time appointments"
        />
        <StatsCard
          title="Pending Appointments"
          value={stats?.pendingAppointments || 0}
          icon={Clock}
          description="Awaiting confirmation"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toFixed(2) || "0.00"}`}
          icon={DollarSign}
          description="From completed orders"
        />
        <StatsCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          description="Registered clients"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={revenueByMonth || {}} />
        <RecentAppointmentsTable appointments={recentAppointments || []} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Button onClick={() => router.push("/admin/appointments")} size="lg">
          Manage Appointments
        </Button>
        <Button onClick={() => router.push("/admin/branches")} size="lg" variant="outline">
          Manage Branches
        </Button>
        <Button onClick={() => router.push("/admin/services")} size="lg" variant="outline">
          Manage Services
        </Button>
      </div>
    </div>
  )
}
