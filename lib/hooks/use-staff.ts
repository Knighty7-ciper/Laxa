"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Staff } from "@/lib/types/database"

export function useStaff(filters?: { branchId?: string; isAvailable?: boolean }) {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchStaff()
  }, [filters?.branchId, filters?.isAvailable])

  const fetchStaff = async () => {
    try {
      setLoading(true)
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

      if (filters?.branchId) query = query.eq("branch_id", filters.branchId)
      if (filters?.isAvailable !== undefined) query = query.eq("is_available", filters.isAvailable)

      const { data, error } = await query

      if (error) throw error

      setStaff(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createStaff = async (staffData: Partial<Staff>) => {
    try {
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

      if (error) throw error

      setStaff([...staff, data])
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateStaff = async (id: string, updates: Partial<Staff>) => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          user:users!staff_user_id_fkey(id, full_name, email, phone, avatar_url),
          branch:branches(id, name, city)
        `,
        )
        .single()

      if (error) throw error

      setStaff(staff.map((s) => (s.id === id ? data : s)))
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deleteStaff = async (id: string) => {
    try {
      const { error } = await supabase.from("staff").delete().eq("id", id)

      if (error) throw error

      setStaff(staff.filter((s) => s.id !== id))
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  return {
    staff,
    loading,
    error,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
  }
}
