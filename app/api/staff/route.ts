import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branch_id")
    const isAvailable = searchParams.get("is_available")

    let query = supabase
      .from("staff")
      .select(
        `
        *,
        user:users!staff_user_id_fkey(id, full_name, email, phone, avatar_url),
        branch:branches(id, name, city)
      `,
      )
      .order("created_at", { ascending: false })

    if (branchId) query = query.eq("branch_id", branchId)
    if (isAvailable !== null) query = query.eq("is_available", isAvailable === "true")

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Get staff error:", error)
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

    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const staffData = await request.json()

    const { data, error } = await supabase
      .from("staff")
      .insert(staffData)
      .select(
        `
        *,
        user:users!staff_user_id_fkey(id, full_name, email, phone, avatar_url),
        branch:branches(id, name, city)
      `,
      )
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Create staff error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
