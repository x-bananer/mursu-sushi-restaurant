import { select, execute } from "../../db.js";

/**
 * @typedef {import("../../../../../types/db/dish.type.js").Dishes} Dishes
 */

export async function getDishes() {
	const rows = await select(`
	SELECT
		dishes.id,
		dishes.name,
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

export async function getDish(dishId) {
	const rows = await select(
		`
			SELECT
  			dishes.id,
  			dishes.name,
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
		[dishId],
	);

	return rows;
}
