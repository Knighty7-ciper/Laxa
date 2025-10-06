"use client"

import type { Product } from "@/lib/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const inStock = product.stock_quantity > 0

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div>
          <CardTitle className="text-lg">{product.name}</CardTitle>
          {product.category && <Badge variant="secondary">{product.category}</Badge>}
        </div>

        {product.description && (
          <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">R {product.price.toFixed(2)}</p>
            {inStock && <p className="text-xs text-muted-foreground">{product.stock_quantity} in stock</p>}
          </div>

          {onAddToCart && (
            <Button onClick={() => onAddToCart(product)} disabled={!inStock} size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
