"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Service } from "@/lib/types/database"

export function useServices(filters?: { branchId?: string; category?: string; isActive?: boolean }) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchServices()
  }, [filters?.branchId, filters?.category, filters?.isActive])

  const fetchServices = async () => {
    try {
      setLoading(true)
      let query = supabase.from("services").select("*").order("name")

      if (filters?.branchId) query = query.eq("branch_id", filters.branchId)
      if (filters?.category) query = query.eq("category", filters.category)
      if (filters?.isActive !== undefined) query = query.eq("is_active", filters.isActive)

      const { data, error } = await query

      if (error) throw error

      setServices(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createService = async (serviceData: Partial<Service>) => {
    try {
      const { data, error } = await supabase.from("services").insert(serviceData).select().single()

      if (error) throw error

      setServices([...services, data])
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const { data, error } = await supabase.from("services").update(updates).eq("id", id).select().single()

      if (error) throw error

      setServices(services.map((s) => (s.id === id ? data : s)))
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id)

      if (error) throw error

      setServices(services.filter((s) => s.id !== id))
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  }
}
