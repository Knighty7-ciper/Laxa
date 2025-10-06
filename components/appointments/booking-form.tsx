"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Branch, Service, Staff } from "@/lib/types/database"

interface BookingFormProps {
  onSubmit: (data: any) => Promise<{ data: any; error: string | null }>
  onSuccess?: () => void
}

export function BookingForm({ onSubmit, onSuccess }: BookingFormProps) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  const [formData, setFormData] = useState({
    branch_id: "",
    service_id: "",
    staff_id: "",
    appointment_date: "",
    start_time: "",
    end_time: "",
    notes: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchBranches()
  }, [])

  useEffect(() => {
    if (formData.branch_id) {
      fetchServices(formData.branch_id)
    }
  }, [formData.branch_id])

  useEffect(() => {
    if (formData.branch_id && formData.service_id) {
      fetchStaff(formData.branch_id, formData.service_id)
    }
  }, [formData.branch_id, formData.service_id])

  useEffect(() => {
    if (formData.staff_id && formData.appointment_date) {
      fetchAvailability(formData.staff_id, formData.appointment_date)
    }
  }, [formData.staff_id, formData.appointment_date])

  const fetchBranches = async () => {
    const { data } = await supabase.from("branches").select("*").eq("is_active", true).order("name")
    if (data) setBranches(data)
  }

  const fetchServices = async (branchId: string) => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("branch_id", branchId)
      .eq("is_active", true)
      .order("name")
    if (data) setServices(data)
  }

  const fetchStaff = async (branchId: string, serviceId: string) => {
    const { data } = await supabase
      .from("staff")
      .select(
        `
        *,
        user:users!staff_user_id_fkey(full_name),
        staff_services!inner(service_id)
      `,
      )
      .eq("branch_id", branchId)
      .eq("is_available", true)
      .eq("staff_services.service_id", serviceId)

    if (data) setStaff(data)
  }

  const fetchAvailability = async (staffId: string, date: string) => {
    const response = await fetch(`/api/appointments/availability?staff_id=${staffId}&date=${date}`)
    const data = await response.json()
    if (data.availableSlots) setAvailableSlots(data.availableSlots)
  }

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const selectedService = services.find((s) => s.id === formData.service_id)
    const endTime = selectedService
      ? calculateEndTime(formData.start_time, selectedService.duration)
      : formData.end_time

    const { data, error: submitError } = await onSubmit({
      ...formData,
      end_time: endTime,
    })

    if (submitError) {
      setError(submitError)
    } else {
      onSuccess?.()
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>Select your preferred service, staff, and time</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="branch">Branch *</Label>
            <Select
              value={formData.branch_id}
              onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name} - {branch.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service *</Label>
            <Select
              value={formData.service_id}
              onValueChange={(value) => setFormData({ ...formData, service_id: value })}
              disabled={!formData.branch_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - R{service.price} ({service.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff">Staff Member *</Label>
            <Select
              value={formData.staff_id}
              onValueChange={(value) => setFormData({ ...formData, staff_id: value })}
              disabled={!formData.service_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.user?.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.appointment_date}
              onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              disabled={!formData.staff_id}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Select
              value={formData.start_time}
              onValueChange={(value) => setFormData({ ...formData, start_time: value })}
              disabled={!formData.appointment_date}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special requests or notes..."
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
