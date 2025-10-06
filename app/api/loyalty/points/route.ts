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

    const { data, error } = await supabase.from("loyalty_points").select("*").eq("user_id", user.id).single()

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      // Create loyalty points record if it doesn't exist
      const { data: newRecord, error: createError } = await supabase
        .from("loyalty_points")
        .insert({
          user_id: user.id,
          points: 0,
          tier: "bronze",
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }

      return NextResponse.json(newRecord)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Get loyalty points error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
