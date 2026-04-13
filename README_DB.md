# SYSTEM OVERVIEW: DATABASE STRUCTURE AND RELATIONSHIPS
![Database ERD](./MURSU%20ERD.png)

This system represents a food ordering application where users can select dishes from a menu or create custom dishes using ingredients.

---

## 1. USER
**Table:** users

Represents a person using the system.

**Example:**
```json
{
  "id": 1,
  "name": "Anna",
  "email": "anna@gmail.com",
  "password_hash": "hashed_password",
  "role_id": 1
}
```

**Relationship:**
- One user can have many orders
- One user can have many favorite dishes

---

## 2. ORDER
**Table:** orders

Represents a single purchase made by a user.

**Example:**
```json
{
  "id": 10,
  "user_id": 1,
  "total_price": 25.5,
  "status_id": 1,
  "delivery_type_id": 2,
  "is_paid": true,
  "address": "Main street 1"
}
```

**Meaning:**
- Each order belongs to a user (or can be anonymous)
- Each order has a status and delivery type

**Relationship:**
- One order → many order items

---

## 3. ORDER ITEMS
**Table:** order_items

Represents individual items inside an order.

**Example:**
```json
{
  "id": 1,
  "order_id": 10,
  "dish_id": 2,
  "type_id": 1,
  "name": "California roll",
  "quantity": 2,
  "price": 10
}
```

**Important:**
An order item can be:
- A predefined dish (from the menu)
- A custom item (created by the user)

---

## 4. DISHES (MENU)
**Table:** dishes

Represents predefined menu items.

**Example:**
```json
{
  "id": 2,
  "name": "California roll",
  "price": 10,
  "is_favorite": true, // if user is logged in, otherwise null
}
```

**Relationship:**
- One dish can appear in many order items
- One dish can have multiple badges
- One dish can be favorited by many users

---

## 5. BADGES
**Tables:** badges, dish_badges

Represents labels assigned to dishes, such as vegan or gluten-free.

**Example:**
```json
{
  "id": 1,
  "name": "vegan"
}
```

**Relationship:**
- One badge can be assigned to many dishes
- One dish can have many badges
- This is a many-to-many relationship implemented through the `dish_badges` table

---

## 6. CUSTOM ORDER ITEMS
**Not a table** (stored in `order_items`)

If a user creates their own custom order item:

**Example:**
```json
{
  "id": 2,
  "dish_id": null,
  "name": "My custom roll",
  "type": "custom",
  "quantity": 1,
  "price": 12
}
```

**Key idea:**
- This is not a separate table
- A custom item is stored in the order_items table
- It has dish_id = null
- Its ingredients are stored in order_item_ingredients

---

## 7. INGREDIENTS
**Table:** ingredients

Represents basic food components for combos.

**Example:**
```json
{
  "id": 1,
  "name": "Salmon",
  "price": 2
}
```

---

## 8. ORDER ITEM INGREDIENTS
**Table:** order_item_ingredients

Connects custom order items with ingredients.

**Example:**
```json
{
  "order_item_id": 2,
  "ingredient_id": 1,
  "quantity": 1,
  "position": 0
}
```

**Meaning:**
- Defines which ingredients are used in a custom item
- Position controls order (important for layered items)

**Relationship:**
- One order item → many ingredients
- One ingredient → used in many order items

---

## 9. FAVORITES
**Table:** user_favorite_dishes

Represents user's favorite dishes.

**Example:**
```json
{
  "user_id": 1,
  "dish_id": 2
}
```

**Relationship:**
- Many-to-many between users and dishes

**Meaning:**
- A user can favorite multiple dishes
- A dish can be favorited by multiple users

---

## 10. LOOKUP TABLES
**Tables:** user_roles, order_statuses, delivery_types, order_item_types

Used to keep data consistent and controlled.

Examples:

Order Status:
```json
{ "id": 1, "name": "pending" }
```

Delivery Type:
```json
{ "id": 2, "name": "restaurant" }
```

User Role:
```json
{ "id": 1, "name": "user" }
```

Order Item Type:
```json
{ "id": 1, "name": "dish" }
```

Available values:

Order Status:
- pending
- preparing
- ready

Delivery Type:
- pickup
- restaurant
- delivery

User Role:
- user
- admin

Order Item Type:
- dish
- custom

**Purpose:**
- Avoid hardcoded strings
- Prevent invalid values
- Simplify updates and maintenance

---

**FULL FLOW (SIMPLE EXPLANATION)**

1. A user creates an order  
2. The order contains multiple items  
3. Each item is either:  
   - A dish from the menu  
   - A custom item made from ingredients  
4. Custom items store their ingredients separately  
5. Users can mark dishes as favorites  
6. Statuses and types are controlled via lookup tables

---

**SHORT SUMMARY**

```
User → Order → OrderItems  
OrderItem → Dish OR Ingredients  
User ↔ Favorite ↔ Dish  
```

This is the complete system structure.