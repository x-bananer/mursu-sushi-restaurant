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

INSERT INTO dishes (id, name, description, price, is_available, created_at)
VALUES
(1, 'Sake Sashimi', '8 slices salmon sashimi with wasabi, ginger, soy sauce and seaweed salad.', 24.00, 1, NOW()),
(2, 'Moguro', '6 slices tuna sashimi with wasabi, ginger and marinated cucumber.', 24.00, 1, NOW()),
(3, 'Hamachi', '8 slices yellowtail sashimi with ponzu, pickled daikon and herb salad.', 26.00, 1, NOW()),
(4, 'Hotate', '6 slices scallop sashimi with yuzu salt, ponzu and cucumber salad.', 22.00, 1, NOW()),
(5, 'Yasai Mori', 'Vegetable selection with avocado, tofu, pickles, rice and miso soup.', 18.00, 1, NOW()),
(6, 'Tako', 'Poached octopus with ponzu, cucumber, rice and miso soup.', 20.00, 1, NOW());


-- ─────────────────────────────────────────────
-- DAILY SPECIAL
-- ─────────────────────────────────────────────

INSERT INTO daily_specials (id, dish_id, valid_on)
VALUES
(1, 1, CURDATE());


-- ─────────────────────────────────────────────
-- INGREDIENTS (FOR COMBO BUILDER + DIETARY ENGINE)
-- ─────────────────────────────────────────────

INSERT INTO ingredients (id, name, price)
VALUES
-- bases
(1, 'Shari Rice', 5.00),
(2, 'Udon Silk', 9.00),
(3, 'Soba Earth', 8.00),

-- proteins
(10, 'Seared Wagyu', 34.00),
(11, 'Bluefin Toro', 28.00),
(12, 'Smoked Tofu', 12.00),

-- toppings
(20, 'Nori Dust', 4.00),
(21, 'Yuzu Zest', 6.00),
(22, 'Daikon Lace', 5.00),
(23, 'Shiso Leaf', 5.00);

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
(1, 2, 1, 3, FALSE, 'Test Street 123', 74.00);


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

INSERT INTO payments (order_id, amount, status_id, provider, provider_ref, created_at)
VALUES
(1, 74.00, 1, 'mobilepay', NULL, NOW());
