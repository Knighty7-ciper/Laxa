"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useBranches } from "@/lib/hooks/use-branches"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDate, formatTime } from "@/lib/utils"

interface Appointment {
  id: string
  appointment_date: string
  appointment_time: string
  status: string
  notes?: string
  users: { full_name: string; email: string; phone?: string }
  services: { name: string; duration: number; price: number }
  staff: { full_name: string }
  branches: { name: string }
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
}

export default function AdminAppointmentsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { branches } = useBranches()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("")

  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedBranch !== "all") params.append("branch_id", selectedBranch)
      if (selectedStatus !== "all") params.append("status", selectedStatus)
      if (selectedDate) params.append("date", selectedDate)

      const response = await fetch(`/api/admin/appointments?${params}`)
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchAppointments()
      }
    } catch (error) {
      console.error("Error updating appointment:", error)
    }
  }

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && user?.role !== "admin") {
      router.push("/")
      return
    }

    fetchAppointments()
  }, [selectedBranch, selectedStatus, selectedDate])

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Appointments</h1>
        <p className="text-muted-foreground">View and manage all salon appointments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
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

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="Filter by date"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No appointments found</p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                      </span>
                      <Badge className={statusColors[appointment.status]}>{appointment.status}</Badge>
                    </div>

                    <div className="grid gap-1 text-sm">
                      <p>
                        <span className="font-medium">Customer:</span> {appointment.users.full_name} (
                        {appointment.users.email}){appointment.users.phone && ` - ${appointment.users.phone}`}
                      </p>
                      <p>
                        <span className="font-medium">Service:</span> {appointment.services.name} (
                        {appointment.services.duration} min - ${appointment.services.price})
                      </p>
                      <p>
                        <span className="font-medium">Staff:</span> {appointment.staff.full_name}
                      </p>
                      <p>
                        <span className="font-medium">Branch:</span> {appointment.branches.name}
                      </p>
                      {appointment.notes && (
                        <p>
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {appointment.status === "pending" && (
                      <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}>
                        Confirm
                      </Button>
                    )}
                    {appointment.status === "confirmed" && (
                      <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, "completed")}>
                        Complete
                      </Button>
                    )}
                    {(appointment.status === "pending" || appointment.status === "confirmed") && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
