"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Review } from "@/lib/types/database"

export function useReviews(filters?: { branchId?: string; staffId?: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchReviews()
  }, [filters?.branchId, filters?.staffId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
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

      if (filters?.branchId) query = query.eq("branch_id", filters.branchId)
      if (filters?.staffId) query = query.eq("staff_id", filters.staffId)

      const { data, error } = await query

      if (error) throw error

      setReviews(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createReview = async (reviewData: Partial<Review>) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert(reviewData)
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

      if (error) throw error

      setReviews([data, ...reviews])
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    createReview,
  }
}
