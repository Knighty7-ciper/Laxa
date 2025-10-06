"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, TrendingUp } from "lucide-react"

interface LoyaltyCardProps {
  points: number
  tier: string
}

export function LoyaltyCard({ points, tier }: LoyaltyCardProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-gradient-to-br from-slate-400 to-slate-600"
      case "gold":
        return "bg-gradient-to-br from-yellow-400 to-yellow-600"
      case "silver":
        return "bg-gradient-to-br from-gray-300 to-gray-500"
      default:
        return "bg-gradient-to-br from-orange-400 to-orange-600"
    }
  }

  const getNextTier = () => {
    if (tier === "bronze") return { name: "Silver", points: 1000 }
    if (tier === "silver") return { name: "Gold", points: 5000 }
    if (tier === "gold") return { name: "Platinum", points: 10000 }
    return null
  }

  const nextTier = getNextTier()

  return (
    <Card className={`${getTierColor(tier)} text-white border-0`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Loyalty Rewards</CardTitle>
            <CardDescription className="text-white/80">Member since 2024</CardDescription>
          </div>
          <Award className="h-12 w-12" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Current Tier</span>
            <Badge variant="secondary" className="uppercase">
              {tier}
            </Badge>
          </div>
          <div className="text-4xl font-bold">{points.toLocaleString()} Points</div>
        </div>

        {nextTier && (
          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm mb-2">
              <TrendingUp className="h-4 w-4" />
              <span>Next Tier: {nextTier.name}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${Math.min((points / nextTier.points) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs mt-1 text-white/80">
              {nextTier.points - points} points to {nextTier.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
