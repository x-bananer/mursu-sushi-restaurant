import { select, execute } from "../../db.js";

/**
 * @typedef {import("../../../../../types/db/dish.type.js").DailySpecials} DailySpecials
 */

export async function getDailySpecial() {
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
		FROM daily_specials
		JOIN dishes ON dishes.id = daily_specials.dish_id
		LEFT JOIN dish_badges ON dish_badges.dish_id = dishes.id
		LEFT JOIN badge ON badge.id = dish_badges.badge_id
		WHERE daily_specials.valid_on = CURDATE()
		GROUP BY dishes.id
		LIMIT 1;
		`);

	return rows;
}
