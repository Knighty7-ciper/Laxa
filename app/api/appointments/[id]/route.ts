import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
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
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Get appointment error:", error)
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
      .from("appointments")
      .update(updates)
      .eq("id", id)
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

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Update appointment error:", error)
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

    const { error } = await supabase.from("appointments").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete appointment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
