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

    // Get branch_id from query params
    const searchParams = request.nextUrl.searchParams
    const branchId = searchParams.get("branch_id")

    // Build query with optional branch filter
    const appointmentsQuery = supabase.from("appointments").select("*", { count: "exact", head: false })

    if (branchId) {
      appointmentsQuery.eq("branch_id", branchId)
    }

    // Get total appointments
    const { count: totalAppointments } = await appointmentsQuery

    // Get pending appointments
    const pendingQuery = supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    if (branchId) {
      pendingQuery.eq("branch_id", branchId)
    }

    const { count: pendingAppointments } = await pendingQuery

    // Get total revenue from completed orders
    const ordersQuery = supabase.from("orders").select("total_amount").eq("status", "completed")

    if (branchId) {
      ordersQuery.eq("branch_id", branchId)
    }

    const { data: orders } = await ordersQuery
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

    // Get total customers
    const { count: totalCustomers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "client")

    // Get recent appointments with details
    const recentQuery = supabase
      .from("appointments")
      .select(`
        *,
        users!appointments_user_id_fkey(full_name, email),
        services(name),
        staff(full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    if (branchId) {
      recentQuery.eq("branch_id", branchId)
    }

    const { data: recentAppointments } = await recentQuery

    // Get revenue by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const revenueQuery = supabase
      .from("orders")
      .select("total_amount, created_at")
      .eq("status", "completed")
      .gte("created_at", sixMonthsAgo.toISOString())

    if (branchId) {
      revenueQuery.eq("branch_id", branchId)
    }

    const { data: revenueData } = await revenueQuery

    // Group revenue by month
    const revenueByMonth = revenueData?.reduce((acc: any, order: any) => {
      const month = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      if (!acc[month]) {
        acc[month] = 0
      }
      acc[month] += Number(order.total_amount)
      return acc
    }, {})

    return NextResponse.json({
      stats: {
        totalAppointments: totalAppointments || 0,
        pendingAppointments: pendingAppointments || 0,
        totalRevenue,
        totalCustomers: totalCustomers || 0,
      },
      recentAppointments: recentAppointments || [],
      revenueByMonth: revenueByMonth || {},
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
