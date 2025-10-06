export type UserRole = "client" | "staff" | "admin"

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no-show"

export type PaymentStatus = "pending" | "paid" | "refunded"

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "refunded"

export type TransactionType = "earned" | "redeemed" | "expired"

export interface Branch {
  id: string
  name: string
  address: string
  city: string
  state?: string
  country: string
  postal_code?: string
  phone: string
  email: string
  opening_hours: Record<string, string>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: UserRole
  branch_id?: string
  avatar_url?: string
  loyalty_points: number
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  branch_id: string
  name: string
  description?: string
  duration: number
  price: number
  category?: string
  is_active: boolean
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  user_id: string
  branch_id: string
  specialization?: string
  bio?: string
  rating: number
  total_reviews: number
  is_available: boolean
  working_hours: Record<string, string>
  created_at: string
  updated_at: string
  user?: User
}

export interface StaffService {
  id: string
  staff_id: string
  service_id: string
  created_at: string
}

export interface Appointment {
  id: string
  branch_id: string
  client_id: string
  staff_id: string
  service_id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  notes?: string
  total_price: number
  payment_status: PaymentStatus
  payment_method?: string
  created_at: string
  updated_at: string
  client?: User
  staff?: Staff
  service?: Service
  branch?: Branch
}

export interface Product {
  id: string
  branch_id: string
  name: string
  description?: string
  price: number
  stock_quantity: number
  category?: string
  brand?: string
  image_url?: string
  is_active: boolean
  sku?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  branch_id: string
  client_id: string
  order_number: string
  total_amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method?: string
  shipping_address?: string
  notes?: string
  created_at: string
  updated_at: string
  client?: User
  branch?: Branch
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  product?: Product
}

export interface Review {
  id: string
  branch_id: string
  client_id: string
  staff_id?: string
  appointment_id?: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
  client?: User
  staff?: Staff
}

export interface LoyaltyTransaction {
  id: string
  user_id: string
  branch_id: string
  points: number
  transaction_type: TransactionType
  reference_id?: string
  reference_type?: string
  description?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}
