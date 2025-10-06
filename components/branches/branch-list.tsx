"use client"

import { useBranches } from "@/lib/hooks/use-branches"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function BranchList() {
  const { branches, loading } = useBranches(true)

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {branches.map((branch) => (
        <Card key={branch.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{branch.name}</CardTitle>
                <CardDescription>
                  {branch.city}, {branch.country}
                </CardDescription>
              </div>
              {branch.is_active && <Badge variant="default">Active</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span className="text-muted-foreground">{branch.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{branch.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{branch.email}</span>
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full bg-transparent">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
