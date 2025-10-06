"use client"

import type { Review } from "@/lib/types/database"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { format } from "date-fns"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={review.user?.avatar_url || "/placeholder.svg"} alt={review.user?.full_name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{review.user?.full_name}</h4>
              <span className="text-sm text-muted-foreground">
                {format(new Date(review.created_at), "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{review.comment}</p>
        {review.staff && (
          <p className="text-xs text-muted-foreground mt-2">Service by: {review.staff.user?.full_name}</p>
        )}
      </CardContent>
    </Card>
  )
}
