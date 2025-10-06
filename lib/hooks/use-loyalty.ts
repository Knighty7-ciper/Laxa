"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface LoyaltyPoints {
  id: string
  user_id: string
  points: number
  tier: string
  created_at: string
  updated_at: string
}

interface LoyaltyTransaction {
  id: string
  user_id: string
  points: number
  type: string
  description: string
  created_at: string
}

export function useLoyalty() {
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null)
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchLoyaltyData()
  }, [])

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true)

      const [pointsResponse, transactionsResponse] = await Promise.all([
        supabase.from("loyalty_points").select("*").single(),
        supabase.from("loyalty_transactions").select("*").order("created_at", { ascending: false }),
      ])

      if (pointsResponse.data) setLoyaltyPoints(pointsResponse.data)
      if (transactionsResponse.data) setTransactions(transactionsResponse.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    loyaltyPoints,
    transactions,
    loading,
    error,
    fetchLoyaltyData,
  }
}
