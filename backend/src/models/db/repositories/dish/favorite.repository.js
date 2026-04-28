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
