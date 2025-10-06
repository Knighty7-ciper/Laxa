-- Enable Row Level Security (RLS) on all tables
-- This ensures data isolation and security

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- BRANCHES POLICIES
-- ============================================
-- Everyone can read active branches
CREATE POLICY "Public branches are viewable by everyone"
  ON branches FOR SELECT
  USING (is_active = true);

-- Only admins can insert/update/delete branches
CREATE POLICY "Admins can manage branches"
  ON branches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- USERS POLICIES
-- ============================================
-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admins and staff can view users in their branch
CREATE POLICY "Staff and admins can view branch users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'staff')
      AND u.branch_id = users.branch_id
    )
  );

-- ============================================
-- SERVICES POLICIES
-- ============================================
-- Everyone can view active services
CREATE POLICY "Active services are viewable by everyone"
  ON services FOR SELECT
  USING (is_active = true);

-- Admins and staff can manage services in their branch
CREATE POLICY "Staff and admins can manage branch services"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff')
      AND users.branch_id = services.branch_id
    )
  );

-- ============================================
-- STAFF POLICIES
-- ============================================
-- Everyone can view staff
CREATE POLICY "Staff profiles are viewable by everyone"
  ON staff FOR SELECT
  USING (is_available = true);

-- Admins can manage staff
CREATE POLICY "Admins can manage staff"
  ON staff FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- APPOINTMENTS POLICIES
-- ============================================
-- Clients can view their own appointments
CREATE POLICY "Clients can view own appointments"
  ON appointments FOR SELECT
  USING (client_id = auth.uid());

-- Clients can create appointments
CREATE POLICY "Clients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (client_id = auth.uid());

-- Clients can cancel their own appointments
CREATE POLICY "Clients can cancel own appointments"
  ON appointments FOR UPDATE
  USING (client_id = auth.uid() AND status = 'pending')
  WITH CHECK (status = 'cancelled');

-- Staff can view appointments in their branch
CREATE POLICY "Staff can view branch appointments"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff')
      AND users.branch_id = appointments.branch_id
    )
  );

-- Staff and admins can manage appointments
CREATE POLICY "Staff and admins can manage appointments"
  ON appointments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff')
      AND users.branch_id = appointments.branch_id
    )
  );

-- ============================================
-- PRODUCTS POLICIES
-- ============================================
-- Everyone can view active products
CREATE POLICY "Active products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

-- Staff and admins can manage products
CREATE POLICY "Staff and admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff')
      AND users.branch_id = products.branch_id
    )
  );

-- ============================================
-- ORDERS POLICIES
-- ============================================
-- Clients can view their own orders
CREATE POLICY "Clients can view own orders"
  ON orders FOR SELECT
  USING (client_id = auth.uid());

-- Clients can create orders
CREATE POLICY "Clients can create orders"
  ON orders FOR INSERT
  WITH CHECK (client_id = auth.uid());

-- Staff and admins can view branch orders
CREATE POLICY "Staff and admins can view branch orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff')
      AND users.branch_id = orders.branch_id
    )
  );

-- Staff and admins can manage orders
CREATE POLICY "Staff and admins can manage orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'staff')
      AND users.branch_id = orders.branch_id
    )
  );

-- ============================================
-- ORDER_ITEMS POLICIES
-- ============================================
-- Clients can view their own order items
CREATE POLICY "Clients can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.client_id = auth.uid()
    )
  );

-- Clients can create order items
CREATE POLICY "Clients can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.client_id = auth.uid()
    )
  );

-- ============================================
-- REVIEWS POLICIES
-- ============================================
-- Everyone can read reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

-- Clients can create reviews for their completed appointments
CREATE POLICY "Clients can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    client_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = reviews.appointment_id
      AND appointments.client_id = auth.uid()
      AND appointments.status = 'completed'
    )
  );

-- ============================================
-- LOYALTY_TRANSACTIONS POLICIES
-- ============================================
-- Users can view their own loyalty transactions
CREATE POLICY "Users can view own loyalty transactions"
  ON loyalty_transactions FOR SELECT
  USING (user_id = auth.uid());

-- System can create loyalty transactions
CREATE POLICY "System can create loyalty transactions"
  ON loyalty_transactions FOR INSERT
  WITH CHECK (true);

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- System can create notifications
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
