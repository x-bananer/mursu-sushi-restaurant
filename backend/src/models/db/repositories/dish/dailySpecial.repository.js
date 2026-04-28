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
  			dishes.created_at
		FROM daily_specials
		JOIN dishes
  			ON dishes.id = daily_specials.dish_id
		WHERE daily_specials.valid_on = CURDATE()
		LIMIT 1
		`);

	return rows;
}
