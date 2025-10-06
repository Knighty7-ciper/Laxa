"use client"

import type { Staff } from "@/lib/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin } from "lucide-react"

interface StaffCardProps {
  staff: Staff
}

export function StaffCard({ staff }: StaffCardProps) {
  const initials = staff.user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={staff.user?.avatar_url || "/placeholder.svg"} alt={staff.user?.full_name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl">{staff.user?.full_name}</CardTitle>
            {staff.specialization && <CardDescription>{staff.specialization}</CardDescription>}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{staff.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">({staff.total_reviews} reviews)</span>
            </div>
          </div>
          <Badge variant={staff.is_available ? "default" : "secondary"}>
            {staff.is_available ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {staff.bio && <p className="text-sm text-muted-foreground">{staff.bio}</p>}

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{staff.branch?.name}</span>
        </div>
      </CardContent>
    </Card>
  )
}
