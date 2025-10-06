import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branch_id")
    const status = searchParams.get("status")
    const clientId = searchParams.get("client_id")
    const staffId = searchParams.get("staff_id")

    let query = supabase
      .from("appointments")
      .select(
        `
        *,
        client:users!appointments_client_id_fkey(id, full_name, email, phone),
        staff:staff!appointments_staff_id_fkey(
          id,
          user:users!staff_user_id_fkey(full_name, email)
        ),
        service:services(id, name, duration, price),
        branch:branches(id, name, city)
      `,
      )
      .order("appointment_date", { ascending: false })
      .order("start_time", { ascending: false })

    if (branchId) query = query.eq("branch_id", branchId)
    if (status) query = query.eq("status", status)
    if (clientId) query = query.eq("client_id", clientId)
    if (staffId) query = query.eq("staff_id", staffId)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Get appointments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const appointmentData = await request.json()

    // Validate appointment data
    if (!appointmentData.branch_id || !appointmentData.service_id || !appointmentData.staff_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get service details for pricing
    const { data: service } = await supabase
      .from("services")
      .select("price")
      .eq("id", appointmentData.service_id)
      .single()

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        ...appointmentData,
        client_id: user.id,
        total_price: service?.price || appointmentData.total_price,
        status: "pending",
        payment_status: "pending",
      })
      .select(
        `
        *,
        client:users!appointments_client_id_fkey(id, full_name, email, phone),
        staff:staff!appointments_staff_id_fkey(
          id,
          user:users!staff_user_id_fkey(full_name, email)
        ),
        service:services(id, name, duration, price),
        branch:branches(id, name, city)
      `,
      )
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Create appointment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
