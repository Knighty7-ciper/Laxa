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

    const { data, error } = await supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Get loyalty transactions error:", error)
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

    const { points, type, description } = await request.json()

    // Get current loyalty points
    const { data: loyaltyData } = await supabase.from("loyalty_points").select("*").eq("user_id", user.id).single()

    if (!loyaltyData) {
      return NextResponse.json({ error: "Loyalty account not found" }, { status: 404 })
    }

    // Calculate new points
    const newPoints = loyaltyData.points + points

    if (newPoints < 0) {
      return NextResponse.json({ error: "Insufficient points" }, { status: 400 })
    }

    // Determine tier
    let tier = "bronze"
    if (newPoints >= 10000) tier = "platinum"
    else if (newPoints >= 5000) tier = "gold"
    else if (newPoints >= 1000) tier = "silver"

    // Update loyalty points
    await supabase
      .from("loyalty_points")
      .update({
        points: newPoints,
        tier,
      })
      .eq("user_id", user.id)

    // Create transaction
    const { data, error } = await supabase
      .from("loyalty_transactions")
      .insert({
        user_id: user.id,
        points,
        type,
        description,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Create loyalty transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
