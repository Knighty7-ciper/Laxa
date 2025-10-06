import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get("staff_id")
    const date = searchParams.get("date")

    if (!staffId || !date) {
      return NextResponse.json({ error: "staff_id and date are required" }, { status: 400 })
    }

    // Get all appointments for the staff on the given date
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("start_time, end_time")
      .eq("staff_id", staffId)
      .eq("appointment_date", date)
      .in("status", ["pending", "confirmed"])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Generate available time slots (9 AM to 6 PM, 30-minute intervals)
    const availableSlots = []
    const startHour = 9
    const endHour = 18

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

        // Check if this slot conflicts with any existing appointment
        const isBooked = appointments?.some((apt) => {
          return timeSlot >= apt.start_time && timeSlot < apt.end_time
        })

        if (!isBooked) {
          availableSlots.push(timeSlot)
        }
      }
    }

    return NextResponse.json({ availableSlots })
  } catch (error) {
    console.error("[v0] Get availability error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
