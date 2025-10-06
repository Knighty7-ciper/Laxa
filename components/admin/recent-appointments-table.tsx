import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatTime } from "@/lib/utils"

interface Appointment {
  id: string
  appointment_date: string
  appointment_time: string
  status: string
  users: { full_name: string; email: string }
  services: { name: string }
  staff: { full_name: string }
}

interface RecentAppointmentsTableProps {
  appointments: Appointment[]
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
}

export function RecentAppointmentsTable({ appointments }: RecentAppointmentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent appointments</p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{appointment.users.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.services.name} with {appointment.staff.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_time)}
                  </p>
                </div>
                <Badge className={statusColors[appointment.status]}>{appointment.status}</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
