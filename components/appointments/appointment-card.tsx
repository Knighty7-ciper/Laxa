"use client"

import type { Appointment } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User, DollarSign } from "lucide-react"
import { format } from "date-fns"

interface AppointmentCardProps {
  appointment: Appointment
  onCancel?: (id: string) => void
  onUpdate?: (id: string, status: string) => void
  showActions?: boolean
}

export function AppointmentCard({ appointment, onCancel, onUpdate, showActions = true }: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "no-show":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "refunded":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{appointment.service?.name}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={getStatusColor(appointment.status)}>{appointment.status}</Badge>
            <Badge variant={getPaymentStatusColor(appointment.payment_status)}>{appointment.payment_status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(appointment.appointment_date), "MMMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {appointment.start_time} - {appointment.end_time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.staff?.user?.full_name || "Staff member"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.branch?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>R {appointment.total_price.toFixed(2)}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">{appointment.notes}</p>
          </div>
        )}

        {showActions && appointment.status === "pending" && (
          <div className="flex gap-2 pt-2">
            {onUpdate && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onUpdate(appointment.id, "confirmed")}
                className="flex-1"
              >
                Confirm
              </Button>
            )}
            {onCancel && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCancel(appointment.id)}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
