-- ── LOOKUP TABLES ─────────────────────────────────────────────

CREATE TABLE user_role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE order_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE delivery_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE order_item_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE payment_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE badge (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- ── USER DOMAIN ─────────────────────────────────────────────

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  photo_url TEXT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role_id INT NOT NULL,
  stamp_count INT DEFAULT 0,
  is_stamp_discount_active BOOLEAN DEFAULT FALSE,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES user_role(id)
);

-- ── DISH DOMAIN ─────────────────────────────────────────────

CREATE TABLE dishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dish_badges (
  dish_id INT,
  badge_id INT,
  PRIMARY KEY (dish_id, badge_id),
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badge(id) ON DELETE CASCADE
);

CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE daily_specials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dish_id INT NOT NULL,
  valid_on DATE NOT NULL,
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

CREATE TABLE user_favorite_dishes (
  user_id INT,
  dish_id INT,
  PRIMARY KEY (user_id, dish_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- ── CART DOMAIN ─────────────────────────────────────────────

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  session_id VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  dish_id INT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  item_type_id INT NOT NULL,
  FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE
);

CREATE TABLE cart_item_ingredient (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_item_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  quantity INT NOT NULL,
  position INT NOT NULL,
  FOREIGN KEY (cart_item_id) REFERENCES cart_item(id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

-- ── ORDER DOMAIN ─────────────────────────────────────────────

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  status_id INT NOT NULL,
  delivery_type_id INT NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  address TEXT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (status_id) REFERENCES order_status(id),
  FOREIGN KEY (delivery_type_id) REFERENCES delivery_type(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  dish_id INT NULL,
  name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  item_type_id INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (item_type_id) REFERENCES order_item_type(id)
);

CREATE TABLE custom_order_item_ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_item_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  quantity INT NOT NULL,
  position INT NOT NULL,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

CREATE TABLE order_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status_id INT NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES order_status(id)
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status_id INT NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_ref VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (status_id) REFERENCES payment_status(id)
);
