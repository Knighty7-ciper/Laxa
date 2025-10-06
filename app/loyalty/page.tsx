"use client"

import { useLoyalty } from "@/lib/hooks/use-loyalty"
import { LoyaltyCard } from "@/components/loyalty/loyalty-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { ArrowUp, ArrowDown } from "lucide-react"

export default function LoyaltyPage() {
  const { loyaltyPoints, transactions, loading } = useLoyalty()

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Loyalty Program</h1>
        <p className="text-muted-foreground">Earn points with every purchase and booking</p>
      </div>

      {loyaltyPoints && <LoyaltyCard points={loyaltyPoints.points} tier={loyaltyPoints.tier} />}

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent points activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${transaction.points > 0 ? "bg-green-100" : "bg-red-100"}`}>
                      {transaction.points > 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(transaction.created_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <Badge variant={transaction.points > 0 ? "default" : "secondary"}>
                    {transaction.points > 0 ? "+" : ""}
                    {transaction.points} pts
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Earn Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Book an appointment</span>
            <Badge>+100 pts</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Complete a service</span>
            <Badge>+50 pts</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Purchase products</span>
            <Badge>+10 pts per R100</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Leave a review</span>
            <Badge>+25 pts</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Refer a friend</span>
            <Badge>+200 pts</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
