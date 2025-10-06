"use client"

import { useCart } from "@/lib/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, total, itemCount } = useCart()
  const router = useRouter()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0" variant="default">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product_id} className="flex gap-4 border-b pb-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.image_url ? (
                      <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium leading-tight">{item.name}</h4>
                    <p className="text-sm font-semibold">R {item.price.toFixed(2)}</p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto"
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>R {total.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={() => router.push("/checkout")}>
                Checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
