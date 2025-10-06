"use client"

import { useState, useEffect } from "react"

interface CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image_url?: string
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("salon_cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem("salon_cart", JSON.stringify(newCart))
  }

  const addToCart = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    const existingItem = cart.find((item) => item.product_id === product.product_id)

    if (existingItem) {
      const newCart = cart.map((item) =>
        item.product_id === product.product_id ? { ...item, quantity: item.quantity + quantity } : item,
      )
      saveCart(newCart)
    } else {
      saveCart([...cart, { ...product, quantity }])
    }
  }

  const removeFromCart = (productId: string) => {
    saveCart(cart.filter((item) => item.product_id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      const newCart = cart.map((item) => (item.product_id === productId ? { ...item, quantity } : item))
      saveCart(newCart)
    }
  }

  const clearCart = () => {
    saveCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  }
}
