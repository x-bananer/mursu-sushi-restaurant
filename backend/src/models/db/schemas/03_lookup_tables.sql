-- ── USER ROLE ─────────────────────────────────────────────

INSERT INTO user_role (id, type, name) VALUES
(1, 'user',  'User'),
(2, 'admin', 'Admin');


-- ── ORDER STATUS ───────────────────────────────────────────

INSERT INTO order_status (id, type, name) VALUES
(1, 'pending',   'Pending'),
(2, 'confirmed', 'Confirmed'),
(3, 'preparing', 'Preparing'),
(4, 'ready',     'Ready'),
(5, 'delivered', 'Delivered'),
(6, 'cancelled', 'Cancelled');


-- ── DELIVERY TYPE ─────────────────────────────────────────

INSERT INTO delivery_type (id, type, name) VALUES
(1, 'pickup',     'Pickup'),
(2, 'restaurant', 'Eat-in'),
(3, 'delivery',   'Delivery');


-- ── ORDER ITEM TYPE ───────────────────────────────────────

INSERT INTO order_item_type (id, type, name) VALUES
(1, 'dish',   'Menu Dish'),
(2, 'custom', 'Custom Combo');


-- ── PAYMENT STATUS ─────────────────────────────────────────

INSERT INTO payment_status (id, type, name) VALUES
(1, 'pending',   'Pending'),
(2, 'completed', 'Completed'),
(3, 'failed',    'Failed');


-- ── BADGE (for dishes) ────────────────────────────────────

INSERT INTO badge (id, name) VALUES
(1, 'Vegan'),
(2, 'Vegetarian'),
(3, 'Gluten-Free'),
(4, 'Lactose-Free'),
(5, 'Dairy-Free'),
(6, 'Nut-Free'),
(7, 'Spicy'),
(8, 'Keto'),
(9, 'High-Protein'),
(10, 'Popular'),
(11, 'New'),
(12, 'Chef Special');

-- ── INGREDIENT TYPE ───────────────────────────

INSERT INTO ingredient_type (id, type, name) VALUES
(1, 'base', 'Base'),
(2, 'filling', 'Filling'),
(3, 'topping', 'Topping');

-- ── DISHES CATEGORIES ───────────────────────────

INSERT INTO dish_categories (id, name, sort_order) VALUES
(1, 'Sashimi', 1),
(2, 'Nigiri', 2),
(3, 'Maki', 3),
(4, 'Temaki', 4),
(5, 'Small Plates', 5),
(6, 'Sake', 6);
