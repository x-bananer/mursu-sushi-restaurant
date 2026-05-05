-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────

INSERT INTO users (id, photo_url, name, email, password_hash, role_id, stamp_count, is_stamp_discount_active)
VALUES
(1, NULL, 'Admin User', 'admin@test.com', '$2b$10$hashedpassword', 2, 0, FALSE),
(2, NULL, 'Test User',  'user@test.com',  '$2b$10$hashedpassword', 1, 3, FALSE);


-- ─────────────────────────────────────────────
-- DISHES
-- ─────────────────────────────────────────────

INSERT INTO dishes (id, name, description, price, is_available, created_at, category_id)
VALUES
-- ── SASHIMI ─────────────────────────────
(1, 'Sake Sashimi', '8 slices salmon sashimi with wasabi, ginger, soy sauce and seaweed salad.', 24.00, 1, NOW(), 1),
(2, 'Maguro Sashimi', '6 slices tuna sashimi with pickled ginger and soy sauce.', 24.00, 1, NOW(), 1),
(3, 'Hamachi Sashimi', 'Yellowtail sashimi with ponzu and citrus zest.', 26.00, 1, NOW(), 1),

-- ── NIGIRI ──────────────────────────────
(4, 'Salmon Nigiri', 'Fresh salmon over pressed sushi rice.', 18.00, 1, NOW(), 2),
(5, 'Tuna Nigiri', 'Lean tuna nigiri with wasabi accent.', 19.00, 1, NOW(), 2),
(6, 'Ebi Nigiri', 'Sweet shrimp nigiri with light soy glaze.', 17.00, 1, NOW(), 2),

-- ── MAKI ────────────────────────────────
(7, 'Spicy Tuna Roll', 'Tuna, chili mayo, cucumber and sesame.', 16.00, 1, NOW(), 3),
(8, 'California Roll', 'Crab, avocado, cucumber and tobiko.', 15.00, 1, NOW(), 3),
(9, 'Avocado Maki', 'Fresh avocado roll with sesame.', 12.00, 1, NOW(), 3),

-- ── TEMAKI ──────────────────────────────
(10, 'Salmon Temaki', 'Hand roll with salmon, rice and nori.', 14.00, 1, NOW(), 4),
(11, 'Spicy Tuna Temaki', 'Cone hand roll with spicy tuna mix.', 15.00, 1, NOW(), 4),

-- ── SMALL PLATES ────────────────────────
(12, 'Edamame', 'Sea salt edamame beans.', 6.00, 1, NOW(), 5),
(13, 'Miso Soup', 'Traditional miso with tofu and seaweed.', 5.00, 1, NOW(), 5),
(14, 'Gyoza', 'Pan-fried pork dumplings with dipping sauce.', 9.00, 1, NOW(), 5),

-- ── SAKE (DRINK CATEGORY) ───────────────
(15, 'Junmai Sake', 'Smooth rice sake with clean finish.', 10.00, 1, NOW(), 6),
(16, 'Nigori Sake', 'Unfiltered sweet sake with creamy texture.', 11.00, 1, NOW(), 6);

-- ─────────────────────────────────────────────
-- DAILY SPECIAL
-- ─────────────────────────────────────────────

INSERT INTO daily_specials (id, dish_id, valid_on)
VALUES
(1, 1, CURDATE());


-- ─────────────────────────────────────────────
-- INGREDIENTS (FOR COMBO BUILDER + DIETARY ENGINE)
-- ─────────────────────────────────────────────

INSERT INTO ingredients (id, name, price, ingredient_type_id, is_available)
VALUES
-- bases
(1, 'Shari Rice', 5.00, 1, TRUE),
(2, 'Udon Silk', 9.00, 1, TRUE),
(3, 'Soba Earth', 8.00, 1, TRUE),

-- proteins
(10, 'Seared Wagyu', 34.00, 2, TRUE),
(11, 'Bluefin Toro', 28.00, 2, TRUE),
(12, 'Smoked Tofu', 12.00, 2, FALSE),

-- toppings
(20, 'Nori Dust', 4.00, 3, TRUE),
(21, 'Yuzu Zest', 6.00, 3, TRUE),
(22, 'Daikon Lace', 5.00, 3, TRUE),
(23, 'Shiso Leaf', 5.00, 3, TRUE);
-- ─────────────────────────────────────────────
-- DISH BADGES
-- ─────────────────────────────────────────────
-- badge ids:
-- 3 Gluten-Free, 4 Lactose-Free, 6 Popular

INSERT INTO dish_badges (dish_id, badge_id)
VALUES
(1, 6), -- Sake Sashimi (Popular)
(1, 3), -- GF
(1, 4), -- LF

(2, 6), -- Moguro
(2, 3), -- GF
(2, 4), -- LF

(3, 6), -- Hamachi (Popular)
(3, 3), -- GF
(3, 4), -- LF

(4, 3), -- Hotate (GF)

(4, 6),  -- Hotate (Popular)
(4, 4),

(5, 3), -- Yasai Mori (GF-ish / vegan not in schema as badge)
(5, 4),

(6, 3),  -- Tako (GF)
(6, 4);


-- ─────────────────────────────────────────────
-- FAVORITES
-- ─────────────────────────────────────────────

INSERT INTO user_favorite_dishes (user_id, dish_id)
VALUES
(1, 1),
(1, 3);


-- ─────────────────────────────────────────────
-- CART (demo active cart)
-- ─────────────────────────────────────────────

INSERT INTO cart (id, user_id, session_id, created_at, updated_at)
VALUES
(1, 2, NULL, NOW(), NOW());


-- ─────────────────────────────────────────────
-- CART ITEMS (FIXED STRUCTURE)
-- ─────────────────────────────────────────────

-- regular dish
INSERT INTO cart_item (id, cart_id, dish_id, quantity, price, item_type_id)
VALUES
(1, 1, 1, 2, 24.00, 1);

-- custom combo
INSERT INTO cart_item (id, cart_id, dish_id, quantity, price, item_type_id)
VALUES
(2, 1, NULL, 1, 50.00, 2);


-- ─────────────────────────────────────────────
-- CART ITEM INGREDIENTS (FIXED IDS)
-- ─────────────────────────────────────────────

INSERT INTO cart_item_ingredient (cart_item_id, ingredient_id, quantity, position)
VALUES
(2, 1, 1, 1),   -- Shari Rice
(2, 12, 1, 2),  -- Smoked Tofu
(2, 21, 1, 3);  -- Yuzu Zest


-- ─────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────

INSERT INTO orders (id, user_id, status_id, delivery_type_id, is_paid, address, total_price)
VALUES
(1, 2, 1, 3, TRUE, 'Test Street 123', 74.00);


-- ─────────────────────────────────────────────
-- ORDER ITEMS (MIRROR CART STRUCTURE)
-- ─────────────────────────────────────────────

INSERT INTO order_items (id, order_id, dish_id, name, quantity, price, item_type_id)
VALUES
(1, 1, 1, 'Sake Sashimi', 2, 24.00, 1),
(2, 1, NULL, 'Custom Vegan Bowl', 1, 50.00, 2);


-- ─────────────────────────────────────────────
-- ORDER ITEM INGREDIENTS
-- ─────────────────────────────────────────────

INSERT INTO custom_order_item_ingredients (order_item_id, ingredient_id, quantity, position)
VALUES
(2, 1, 1, 1),
(2, 12, 1, 2),
(2, 21, 1, 3);


-- ─────────────────────────────────────────────
-- ORDER STATUS HISTORY
-- ─────────────────────────────────────────────

INSERT INTO order_status_history (order_id, status_id, changed_at)
VALUES
(1, 1, NOW());


-- ─────────────────────────────────────────────
-- PAYMENTS (CONSISTENT WITH ORDER)
-- ─────────────────────────────────────────────

INSERT INTO payments (order_id, user_id, amount, status_id, provider, provider_ref, created_at)
VALUES
(1, 2, 74.00, 1, 'mobilepay', NULL, NOW());
