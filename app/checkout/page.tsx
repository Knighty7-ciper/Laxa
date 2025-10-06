"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/hooks/use-cart"
import { useBranches } from "@/lib/hooks/use-branches"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import Image from "next/image"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, total, clearCart } = useCart()
  const { branches } = useBranches(true)
  const supabase = getSupabaseBrowserClient()

  const [formData, setFormData] = useState({
    branch_id: "",
    delivery_address: "",
    delivery_method: "pickup",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          branch_id: formData.branch_id,
          total_amount: total,
          delivery_address: formData.delivery_method === "delivery" ? formData.delivery_address : null,
          delivery_method: formData.delivery_method,
          status: "pending",
          payment_status: "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      router.push(`/orders/${order.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="branch">Pickup Branch *</Label>
                  <Select
                    value={formData.branch_id}
                    onValueChange={(value) => setFormData({ ...formData, branch_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name} - {branch.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery_method">Delivery Method *</Label>
                  <Select
                    value={formData.delivery_method}
                    onValueChange={(value) => setFormData({ ...formData, delivery_method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.delivery_method === "delivery" && (
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input
                      id="address"
                      value={formData.delivery_address}
                      onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                      placeholder="Enter your delivery address"
                      required
                    />
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>{cart.length} items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product_id} className="flex gap-3">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {item.image_url ? (
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-xs text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x R {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">R {(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span>
                  <span>{formData.delivery_method === "delivery" ? "R 50.00" : "Free"}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>R {(total + (formData.delivery_method === "delivery" ? 50 : 0)).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
