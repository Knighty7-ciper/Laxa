"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Appointment } from "@/lib/types/database"

export function useAppointments(filters?: {
  branchId?: string
  status?: string
  clientId?: string
  staffId?: string
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchAppointments()
  }, [filters?.branchId, filters?.status, filters?.clientId, filters?.staffId])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      let query = supabase
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
        .order("appointment_date", { ascending: false })
        .order("start_time", { ascending: false })

      if (filters?.branchId) query = query.eq("branch_id", filters.branchId)
      if (filters?.status) query = query.eq("status", filters.status)
      if (filters?.clientId) query = query.eq("client_id", filters.clientId)
      if (filters?.staffId) query = query.eq("staff_id", filters.staffId)

      const { data, error } = await query

      if (error) throw error

      setAppointments(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createAppointment = async (appointmentData: Partial<Appointment>) => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .insert(appointmentData)
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

      if (error) throw error

      setAppointments([data, ...appointments])
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    try {
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

      if (error) throw error

      setAppointments(appointments.map((a) => (a.id === id ? data : a)))
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const cancelAppointment = async (id: string) => {
    return updateAppointment(id, { status: "cancelled" })
  }

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
  }
}
