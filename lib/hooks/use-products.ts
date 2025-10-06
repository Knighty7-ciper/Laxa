"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/types/database"

export function useProducts(filters?: { branchId?: string; category?: string; inStock?: boolean }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchProducts()
  }, [filters?.branchId, filters?.category, filters?.inStock])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let query = supabase.from("products").select("*").order("name")

      if (filters?.branchId) query = query.eq("branch_id", filters.branchId)
      if (filters?.category) query = query.eq("category", filters.category)
      if (filters?.inStock) query = query.gt("stock_quantity", 0)

      const { data, error } = await query

      if (error) throw error

      setProducts(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase.from("products").insert(productData).select().single()

      if (error) throw error

      setProducts([...products, data])
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

      if (error) throw error

      setProducts(products.map((p) => (p.id === id ? data : p)))
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error

      setProducts(products.filter((p) => p.id !== id))
      return { error: null }
    } catch (err: any) {
      return { error: err.message }
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
