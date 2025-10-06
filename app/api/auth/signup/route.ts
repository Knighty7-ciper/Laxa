import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, phone, role = "client" } = await request.json()

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000"}/auth/callback`,
        data: {
          full_name,
          phone,
          role,
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 400 })
    }

    return NextResponse.json({
      message: "User created successfully. Please check your email to confirm your account.",
      user: authData.user,
    })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
