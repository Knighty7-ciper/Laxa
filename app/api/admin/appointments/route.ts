import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams
    const branchId = searchParams.get("branch_id")
    const status = searchParams.get("status")
    const date = searchParams.get("date")

    // Build query
    let query = supabase
      .from("appointments")
      .select(`
        *,
        users!appointments_user_id_fkey(full_name, email, phone),
        services(name, duration, price),
        staff(full_name),
        branches(name)
      `)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })

    if (branchId) {
      query = query.eq("branch_id", branchId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (date) {
      query = query.eq("appointment_date", date)
    }

    const { data: appointments, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Error fetching admin appointments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
