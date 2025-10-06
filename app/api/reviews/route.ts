import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branch_id")
    const staffId = searchParams.get("staff_id")

    let query = supabase
      .from("reviews")
      .select(
        `
        *,
        user:users!reviews_user_id_fkey(id, full_name, avatar_url),
        branch:branches(id, name),
        staff:staff!reviews_staff_id_fkey(
          id,
          user:users!staff_user_id_fkey(full_name)
        )
      `,
      )
      .order("created_at", { ascending: false })

    if (branchId) query = query.eq("branch_id", branchId)
    if (staffId) query = query.eq("staff_id", staffId)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Get reviews error:", error)
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

    const reviewData = await request.json()

    // Check if user has completed appointment
    const { data: appointment } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", reviewData.appointment_id)
      .eq("client_id", user.id)
      .eq("status", "completed")
      .single()

    if (!appointment) {
      return NextResponse.json({ error: "You can only review completed appointments" }, { status: 403 })
    }

    // Check if review already exists
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("appointment_id", reviewData.appointment_id)
      .single()

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this appointment" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        ...reviewData,
        user_id: user.id,
      })
      .select(
        `
        *,
        user:users!reviews_user_id_fkey(id, full_name, avatar_url),
        branch:branches(id, name),
        staff:staff!reviews_staff_id_fkey(
          id,
          user:users!staff_user_id_fkey(full_name)
        )
      `,
      )
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update staff rating
    if (reviewData.staff_id) {
      const { data: reviews } = await supabase.from("reviews").select("rating").eq("staff_id", reviewData.staff_id)

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

        await supabase
          .from("staff")
          .update({
            rating: avgRating,
            total_reviews: reviews.length,
          })
          .eq("id", reviewData.staff_id)
      }
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Create review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
