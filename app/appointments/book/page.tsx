"use client"

import { useRouter } from "next/navigation"
import { BookingForm } from "@/components/appointments/booking-form"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function BookAppointmentPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleSubmit = async (data: any) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return { data: null, error: "You must be logged in to book an appointment" }
      }

      // Get service price
      const { data: service } = await supabase.from("services").select("price").eq("id", data.service_id).single()

      const { data: appointment, error } = await supabase
        .from("appointments")
        .insert({
          ...data,
          client_id: user.id,
          total_price: service?.price || 0,
          status: "pending",
          payment_status: "pending",
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      return { data: appointment, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const handleSuccess = () => {
    router.push("/appointments")
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
        <p className="text-muted-foreground">Schedule your next salon visit</p>
      </div>
      <BookingForm onSubmit={handleSubmit} onSuccess={handleSuccess} />
    </div>
  )
}
