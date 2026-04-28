import * as dishRepo from "../../models/db/repositories/dish/dish.repository.js";
import * as dailySpecialRepo from "../../models/db/repositories/dish/dailySpecial.repository.js";

export async function getDishes() {
	const dishes = await dishRepo.getDishes();

	return dishes;
}

export async function getDailySpecial() {
	const special = await dailySpecialRepo.getDailySpecial();

	return special;
}
