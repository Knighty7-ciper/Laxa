import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branch_id")
    const category = searchParams.get("category")
    const isActive = searchParams.get("is_active")

    let query = supabase.from("services").select("*").order("name")

    if (branchId) query = query.eq("branch_id", branchId)
    if (category) query = query.eq("category", category)
    if (isActive !== null) query = query.eq("is_active", isActive === "true")

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Get services error:", error)
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

    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!userData || !["admin", "staff"].includes(userData.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const serviceData = await request.json()

    const { data, error } = await supabase.from("services").insert(serviceData).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Create service error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
