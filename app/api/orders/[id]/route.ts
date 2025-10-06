import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        user:users!orders_user_id_fkey(id, full_name, email, phone),
        branch:branches(id, name, city),
        order_items(
          *,
          product:products(id, name, price, image_url)
        )
      `,
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Get order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
      .from("orders")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select(
        `
        *,
        user:users!orders_user_id_fkey(id, full_name, email, phone),
        branch:branches(id, name, city)
      `,
      )
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Update order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
