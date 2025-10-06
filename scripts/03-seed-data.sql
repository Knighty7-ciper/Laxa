-- Seed data for testing and initial setup

-- Insert sample branches
INSERT INTO branches (id, name, address, city, country, phone, email, opening_hours) VALUES
  ('11111111-1111-1111-1111-111111111111', 'LuxeSalon Downtown', '123 Main Street', 'Johannesburg', 'South Africa', '+27 11 123 4567', 'downtown@luxesalon.co.za', 
   '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-20:00", "friday": "09:00-20:00", "saturday": "08:00-17:00", "sunday": "closed"}'),
  ('22222222-2222-2222-2222-222222222222', 'LuxeSalon Sandton', '456 Rivonia Road', 'Sandton', 'South Africa', '+27 11 234 5678', 'sandton@luxesalon.co.za',
   '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-20:00", "friday": "09:00-20:00", "saturday": "08:00-17:00", "sunday": "10:00-16:00"}');

-- Note: Users will be created through Supabase Auth signup
-- After signup, their profile will be created in the users table via trigger or API

-- Insert sample services for Downtown branch
INSERT INTO services (branch_id, name, description, duration, price, category, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Haircut & Styling', 'Professional haircut with styling', 60, 350.00, 'Hair', true),
  ('11111111-1111-1111-1111-111111111111', 'Hair Coloring', 'Full hair coloring service', 120, 850.00, 'Hair', true),
  ('11111111-1111-1111-1111-111111111111', 'Manicure', 'Classic manicure with polish', 45, 200.00, 'Nails', true),
  ('11111111-1111-1111-1111-111111111111', 'Pedicure', 'Relaxing pedicure treatment', 60, 280.00, 'Nails', true),
  ('11111111-1111-1111-1111-111111111111', 'Facial Treatment', 'Deep cleansing facial', 75, 450.00, 'Skincare', true),
  ('11111111-1111-1111-1111-111111111111', 'Massage Therapy', 'Full body relaxation massage', 90, 600.00, 'Wellness', true);

-- Insert sample services for Sandton branch
INSERT INTO services (branch_id, name, description, duration, price, category, is_active) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Haircut & Styling', 'Professional haircut with styling', 60, 400.00, 'Hair', true),
  ('22222222-2222-2222-2222-222222222222', 'Hair Coloring', 'Full hair coloring service', 120, 950.00, 'Hair', true),
  ('22222222-2222-2222-2222-222222222222', 'Manicure', 'Classic manicure with polish', 45, 250.00, 'Nails', true),
  ('22222222-2222-2222-2222-222222222222', 'Pedicure', 'Relaxing pedicure treatment', 60, 320.00, 'Nails', true),
  ('22222222-2222-2222-2222-222222222222', 'Facial Treatment', 'Deep cleansing facial', 75, 500.00, 'Skincare', true);

-- Insert sample products for Downtown branch
INSERT INTO products (branch_id, name, description, price, stock_quantity, category, brand, sku, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Argan Oil Shampoo', 'Nourishing shampoo with argan oil', 185.00, 50, 'Hair Care', 'LuxeHair', 'LH-SH-001', true),
  ('11111111-1111-1111-1111-111111111111', 'Hydrating Conditioner', 'Deep hydration conditioner', 195.00, 45, 'Hair Care', 'LuxeHair', 'LH-CD-001', true),
  ('11111111-1111-1111-1111-111111111111', 'Nail Polish - Ruby Red', 'Long-lasting nail polish', 95.00, 100, 'Nail Care', 'GlamNails', 'GN-NP-001', true),
  ('11111111-1111-1111-1111-111111111111', 'Face Serum - Vitamin C', 'Brightening face serum', 450.00, 30, 'Skincare', 'GlowSkin', 'GS-SR-001', true),
  ('11111111-1111-1111-1111-111111111111', 'Moisturizing Cream', 'Daily moisturizer for all skin types', 320.00, 40, 'Skincare', 'GlowSkin', 'GS-MC-001', true);

-- Insert sample products for Sandton branch
INSERT INTO products (branch_id, name, description, price, stock_quantity, category, brand, sku, is_active) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Argan Oil Shampoo', 'Nourishing shampoo with argan oil', 185.00, 60, 'Hair Care', 'LuxeHair', 'LH-SH-002', true),
  ('22222222-2222-2222-2222-222222222222', 'Hydrating Conditioner', 'Deep hydration conditioner', 195.00, 55, 'Hair Care', 'LuxeHair', 'LH-CD-002', true),
  ('22222222-2222-2222-2222-222222222222', 'Hair Mask - Repair', 'Intensive repair hair mask', 280.00, 35, 'Hair Care', 'LuxeHair', 'LH-HM-001', true);
