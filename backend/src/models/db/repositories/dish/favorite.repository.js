import { select, execute } from "../../db.js";

/**
 * @typedef {import("../../../../../types/db/dish.type.js").UserFavoriteDishes} UserFavoriteDishes
 */

export async function getUserFavorites(userId) {
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
		FROM user_favorite_dishes
		JOIN dishes ON dishes.id = user_favorite_dishes.dish_id
		LEFT JOIN dish_badges ON dish_badges.dish_id = dishes.id
		LEFT JOIN badge ON badge.id = dish_badges.badge_id
		WHERE user_favorite_dishes.user_id = ?
		GROUP BY dishes.id;
		`,
		[userId],
	);

	return rows;
}

export async function addFavorite(userId, dishId) {
	await execute(
		`
		INSERT INTO user_favorite_dishes (user_id, dish_id)
		VALUES (?, ?);
		`,
		[userId, dishId],
	);
}

export async function removeFavorite(userId, dishId) {
	const result = await execute(
		`
		DELETE FROM user_favorite_dishes
		WHERE user_id = ? AND dish_id = ?;
		`,
		[userId, dishId],
	);

	return result.affectedRows > 0;
}
