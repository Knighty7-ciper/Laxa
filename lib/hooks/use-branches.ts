"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Branch } from "@/lib/types/database"

export function useBranches(isActive?: boolean) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchBranches()
  }, [isActive])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      let query = supabase.from("branches").select("*").order("name")

      if (isActive !== undefined) {
        query = query.eq("is_active", isActive)
      }

      const { data, error } = await query

      if (error) throw error

      setBranches(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createBranch = async (branchData: Partial<Branch>) => {
    try {
      const { data, error } = await supabase.from("branches").insert(branchData).select().single()

      if (error) throw error

      setBranches([...branches, data])
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateBranch = async (id: string, updates: Partial<Branch>) => {
    try {
      const { data, error } = await supabase.from("branches").update(updates).eq("id", id).select().single()

      if (error) throw error

      setBranches(branches.map((b) => (b.id === id ? data : b)))
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deleteBranch = async (id: string) => {
    try {
      const { error } = await supabase.from("branches").delete().eq("id", id)

      if (error) throw error

      setBranches(branches.filter((b) => b.id !== id))
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  return {
    branches,
    loading,
    error,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,
  }
}
