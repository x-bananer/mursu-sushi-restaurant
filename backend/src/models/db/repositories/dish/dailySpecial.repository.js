import { select, execute } from '../../db.js';

/**
 * @typedef {import("../../../../../types/db/dish.type.js").DailySpecials} DailySpecials
 */

export async function getDailySpecial() {
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
					'id', badge.id,
					'name', badge.name
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

export async function getAllDailySpecials() {
	const rows = await select(`
		SELECT
			daily_specials.id,
			daily_specials.valid_on,
			dishes.id AS dish_id,
			dishes.name,
			dishes.category_id,
			dishes.description,
			dishes.price,
			dishes.is_available,
			dishes.created_at,
			JSON_ARRAYAGG(
				JSON_OBJECT(
					'id', badge.id,
					'name', badge.name
				)
			) AS badges
		FROM daily_specials
		JOIN dishes ON dishes.id = daily_specials.dish_id
		LEFT JOIN dish_badges ON dish_badges.dish_id = dishes.id
		LEFT JOIN badge ON badge.id = dish_badges.badge_id
		GROUP BY daily_specials.id, daily_specials.valid_on, dishes.id
		ORDER BY daily_specials.valid_on ASC, daily_specials.id ASC;
	`);

	return rows;
}

export async function createDailySpecial({ dishId, validOn }) {
	const result = await execute(
		`
		INSERT INTO daily_specials (dish_id, valid_on)
		VALUES (?, ?);
		`,
		[dishId, validOn]
	);

	return result.insertId;
}

export async function deleteDailySpecialByValidOn(validOn) {
	const result = await execute(
		`
		DELETE FROM daily_specials
		WHERE valid_on = ?;
		`,
		[validOn]
	);

	return result.affectedRows;
}

export async function getDailySpecialById(id) {
	const rows = await select(
		`
		SELECT id, dish_id, valid_on
		FROM daily_specials
		WHERE id = ?
		LIMIT 1;
		`,
		[id]
	);

	return rows[0] ?? null;
}

export async function updateDailySpecialByDishId(dishId, validOn) {
	const result = await execute(
		`
		UPDATE daily_specials
		SET valid_on = ?
		WHERE dish_id = ?;
		`,
		[validOn, dishId]
	);

	return result.affectedRows;
}

export async function deleteDailySpecialByDishId(dishId) {
	const result = await execute(
		`
		DELETE FROM daily_specials
		WHERE dish_id = ?;
		`,
		[dishId]
	);

	return result.affectedRows;
}
