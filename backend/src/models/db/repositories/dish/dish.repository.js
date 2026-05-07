import { select, execute } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/dish.type.js").Dishes} Dishes
 */

export async function getDishes() {
	const rows = await select(`
	SELECT
		dishes.id,
		dishes.name,
		dishes.category_id,
		dishes.description,
		dishes.price,
		dishes.is_available,
		dishes.created_at,
		JSON_ARRAYAGG(
			JSON_OBJECT(
				"id", badge.id,
				"name", badge.name
			)
		) AS badges
	FROM dishes
	LEFT JOIN dish_badges ON dish_badges.dish_id = dishes.id
	LEFT JOIN badge ON badge.id = dish_badges.badge_id
	GROUP BY dishes.id;
	`);

	return rows;
}

export async function getDishCategories() {
	const rows = await select(
		`
		SELECT id, name, sort_order
		FROM dish_categories
		ORDER BY sort_order ASC, id ASC
		`
	);

	return rows;
}

export async function createDishCategory({ name, sort_order = 0 }) {
	const result = await execute(
		`
		INSERT INTO dish_categories (name, sort_order)
		VALUES (?, ?);
		`,
		[name, sort_order]
	);

	return result.insertId;
}

export async function getDishCategoryById(categoryId) {
	const rows = await select(
		`
		SELECT id, name, sort_order
		FROM dish_categories
		WHERE id = ?
		LIMIT 1;
		`,
		[categoryId]
	);

	return rows[0] ?? null;
}

export async function updateDishCategoryById(categoryId, updates) {
	const fields = [];
	const values = [];

	for (const [key, value] of Object.entries(updates)) {
		fields.push(`${key} = ?`);
		values.push(value);
	}

	if (!fields.length) {
		return 0;
	}

	values.push(categoryId);

	const result = await execute(
		`
		UPDATE dish_categories
		SET ${fields.join(', ')}
		WHERE id = ?;
		`,
		values
	);

	return result.affectedRows;
}

export async function deleteDishCategoryById(categoryId) {
	const result = await execute(
		`
		DELETE FROM dish_categories
		WHERE id = ?;
		`,
		[categoryId]
	);

	return result.affectedRows;
}

export async function getDish(dishId) {
	const rows = await select(
		`
			SELECT
  			dishes.id,
  			dishes.name,
  			dishes.category_id,
  			dishes.description,
  			dishes.price,
  			dishes.is_available,
  			dishes.created_at,
			JSON_ARRAYAGG(
				JSON_OBJECT(
					"id", badge.id,
					"name", badge.name
				)
			) AS badges
		FROM dishes
		LEFT JOIN dish_badges ON dish_badges.dish_id = dishes.id
		LEFT JOIN badge ON badge.id = dish_badges.badge_id
		WHERE dishes.id = ?;
		`,
		[dishId]
	);

	return rows;
}

export async function createDish({
	name,
	category_id = null,
	description,
	price,
	is_available = true,
}) {
	const result = await execute(
		`
		INSERT INTO dishes (name, category_id, description, price, is_available)
		VALUES (?, ?, ?, ?, ?);
		`,
		[name, category_id, description ?? null, price, Boolean(is_available)]
	);

	return result.insertId;
}

export async function updateDishById(dishId, updates) {
	const fields = [];
	const values = [];

	for (const [key, value] of Object.entries(updates)) {
		fields.push(`${key} = ?`);
		values.push(value);
	}

	if (!fields.length) {
		return 0;
	}

	values.push(dishId);

	const result = await execute(
		`
		UPDATE dishes
		SET ${fields.join(', ')}
		WHERE id = ?;
		`,
		values
	);

	return result.affectedRows;
}

export async function deleteDishById(dishId) {
	const result = await execute(
		`
		DELETE FROM dishes
		WHERE id = ?;
		`,
		[dishId]
	);

	return result.affectedRows;
}
