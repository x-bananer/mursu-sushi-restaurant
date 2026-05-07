# types/db/

JSDoc type definitions that mirror the exact shape of every database table.

These types describe **raw rows as returned by the database driver** — nothing more, nothing less. They are not API responses, not DTOs, not engine inputs. They reflect the table schema column by column.

---

## Purpose

Every repository function returns one of these types. Services consume them. Controllers never expose them directly to the client — they transform them into response DTOs first.

```
Repository → returns DbType → Service transforms → Controller shapes → DTO sent to client
```

If a column exists in the database it exists here. If it does not exist in the database it does not exist here — computed fields and joined data belong in the DTO types, not here.

---

## Files

```
types/
├── db/               # divided by domain
  ├── dish.type.js          — dishes, badges, dish_badges, ingredients, daily_specials
  ├── order.type.js         — orders, order_items, order_item_ingredients,
                              order_status_history, payments
  └── user.type.js          — users, user_rewards, user_roles
├──  common.type.js        — order_statuses, delivery_types, order_item_types
```

## IMPORTANT: common.type tables are seeded once and never mutated at runtime. Repositories read them; services use their `id` values when inserting rows into other tables.

## How to use in a repository file

Import the type with a `@typedef` import at the top of the repository file, then annotate the return type of each function.

```js
// repositories/order/order.repository.js

/** @typedef {import('../../types/db/order.type.js').Orders} Orders */

/**
 * @param {number} id
 * @returns {Promise<Orders|null>}
 */
export async function getOrderById(id) {
	const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
	return rows[0] ?? null;
}

/**
 * @returns {Promise<Orders[]>}
 */
export async function getOrdersByUserId(userId) {
	const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [
		userId,
	]);
	return rows;
}
```

---

## How to use in a service file

Services receive DB types from repositories and transform them before passing to controllers.

```js
// services/order.service.js

/** @typedef {import('../types/db/order.type.js').Orders}      Orders      */
/** @typedef {import('../types/db/order.type.js').OrderItems}  OrderItems  */
/** @typedef {import('../types/controllers/order.type.js').OrderResponse} OrderResponse */

/**
 * Transforms a raw Orders row into the response DTO.
 * @param {Orders}        order
 * @param {OrderItems[]}  items
 * @returns {OrderResponse}
 */
function toOrderResponse(order, items) {
	return {
		id: order.id,
		total_price: order.total_price,
		is_paid: order.is_paid,
		address: order.address,
		notes: order.notes,
		created_at: order.created_at.Date(),
		items: items.map(toOrderItemResponse),
	};
}
```

---
