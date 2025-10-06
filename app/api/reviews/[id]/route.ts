import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    const { data, error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
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

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Update review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("reviews").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
