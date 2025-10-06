"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useAppointments } from "@/lib/hooks/use-appointments"
import { AppointmentCard } from "@/components/appointments/appointment-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function AppointmentsPage() {
  const { user } = useAuth()
  const { appointments, loading, cancelAppointment } = useAppointments({ clientId: user?.id })

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      await cancelAppointment(id)
    }
  }

  const filterByStatus = (status: string) => {
    return appointments.filter((apt) => apt.status === status)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground">View and manage your bookings</p>
        </div>
        <Link href="/appointments/book">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterByStatus("pending").length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({filterByStatus("confirmed").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filterByStatus("completed").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onCancel={handleCancel} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterByStatus("pending").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onCancel={handleCancel} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="confirmed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterByStatus("confirmed").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onCancel={handleCancel} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterByStatus("completed").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} showActions={false} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
