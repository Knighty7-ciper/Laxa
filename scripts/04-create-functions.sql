-- Database functions and triggers

-- ============================================
-- Function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Function to update staff rating after review
-- ============================================
CREATE OR REPLACE FUNCTION update_staff_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE staff
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM reviews
      WHERE staff_id = NEW.staff_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE staff_id = NEW.staff_id
    )
  WHERE id = NEW.staff_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_staff_rating_trigger
AFTER INSERT ON reviews
FOR EACH ROW
WHEN (NEW.staff_id IS NOT NULL)
EXECUTE FUNCTION update_staff_rating();

-- ============================================
-- Function to award loyalty points
-- ============================================
CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
  points_to_award INTEGER;
BEGIN
  -- Award 1 point for every R10 spent
  IF NEW.status = 'completed' AND NEW.payment_status = 'paid' THEN
    points_to_award := FLOOR(NEW.total_price / 10);
    
    -- Update user loyalty points
    UPDATE users
    SET loyalty_points = loyalty_points + points_to_award
    WHERE id = NEW.client_id;
    
    -- Record transaction
    INSERT INTO loyalty_transactions (user_id, branch_id, points, transaction_type, reference_id, reference_type, description)
    VALUES (NEW.client_id, NEW.branch_id, points_to_award, 'earned', NEW.id, 'appointment', 'Points earned from appointment');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER award_loyalty_points_trigger
AFTER UPDATE ON appointments
FOR EACH ROW
WHEN (NEW.status = 'completed' AND NEW.payment_status = 'paid')
EXECUTE FUNCTION award_loyalty_points();

-- ============================================
-- Function to generate order number
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE TRIGGER generate_order_number_trigger
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- ============================================
-- Function to update product stock after order
-- ============================================
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_stock_trigger
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();

-- ============================================
-- Function to automatically create user profile
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, role, loyalty_points)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
