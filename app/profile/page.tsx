"use client"

import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Calendar, Star, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"
import { useLoyalty } from "@/lib/hooks/use-loyalty"

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { points, tier } = useLoyalty()

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      setProfile({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user, authLoading, router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const tierColors: Record<string, string> = {
    bronze: "bg-orange-600",
    silver: "bg-gray-400",
    gold: "bg-yellow-500",
    platinum: "bg-purple-600",
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <div className="flex gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-2" />
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-2" />
                <Input id="email" type="email" value={profile.email} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-2" />
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Status */}
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <Badge className={`${tierColors[tier || "bronze"]} text-white text-lg px-4 py-2`}>
                {tier?.toUpperCase() || "BRONZE"}
              </Badge>
              <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                <Star className="h-8 w-8 text-yellow-500" />
                {points || 0}
              </div>
              <p className="text-sm text-muted-foreground">Loyalty Points</p>
            </div>

            <Button className="w-full" onClick={() => router.push("/loyalty")}>
              View Rewards
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push("/appointments")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Calendar className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">My Appointments</h3>
                <p className="text-sm text-muted-foreground">View and manage bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push("/orders")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <ShoppingBag className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">My Orders</h3>
                <p className="text-sm text-muted-foreground">Track your purchases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => router.push("/reviews")}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Star className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-semibold">My Reviews</h3>
                <p className="text-sm text-muted-foreground">Share your experience</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
