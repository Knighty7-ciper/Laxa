"use client"

import { useReviews } from "@/lib/hooks/use-reviews"
import { ReviewCard } from "@/components/reviews/review-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star } from "lucide-react"

export default function ReviewsPage() {
  const { reviews, loading } = useReviews()

  const filterByRating = (rating: number) => {
    return reviews.filter((review) => review.rating === rating)
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Reviews</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
          <TabsTrigger value="5">5 Stars ({filterByRating(5).length})</TabsTrigger>
          <TabsTrigger value="4">4 Stars ({filterByRating(4).length})</TabsTrigger>
          <TabsTrigger value="3">3 Stars ({filterByRating(3).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </TabsContent>

        {[5, 4, 3].map((rating) => (
          <TabsContent key={rating} value={rating.toString()} className="mt-6 space-y-4">
            {filterByRating(rating).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
