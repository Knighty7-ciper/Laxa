"use client"

import type { Service } from "@/lib/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign } from "lucide-react"

interface ServiceCardProps {
  service: Service
  onBook?: (serviceId: string) => void
  showBookButton?: boolean
}

export function ServiceCard({ service, onBook, showBookButton = true }: ServiceCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{service.name}</CardTitle>
            {service.category && <Badge variant="secondary">{service.category}</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {service.description && <CardDescription className="text-sm">{service.description}</CardDescription>}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{service.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <DollarSign className="h-4 w-4" />
            <span>R {service.price.toFixed(2)}</span>
          </div>
        </div>

        {showBookButton && onBook && (
          <Button onClick={() => onBook(service.id)} className="w-full">
            Book Now
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
