import { placeholder } from "../utils/paceholder.js";
import * as dishService from "../services/dish/dish.service.js";

export async function list(req, res) {
	try {
		const dishes = await dishService.getDishes();

		res.json({ dishes });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong" });
	}
}

export async function specials(req, res) {
	try {
		const dish = await dishService.getDailySpecial();

		res.json({ dish });
	} catch (err) {
		res.status(500).json({ message: "Something went wrong" });
	}
}

export const get = placeholder("dishes.get");

export async function listFavorites(req, res) {
	const userId = 1;
	try {
		const favorites = await dishService.getUserFavorites(userId);
		console.log("FAVOR");
		res.json({ favorites });
	} catch (err) {
		console.log("ERRORI");
		res.status(500).json({ message: "Something went wrong" });
	}
}
export const addFavorite = placeholder("dishes.addFavorite");
export const removeFavorite = placeholder("dishes.removeFavorite");

export const listIngredients = placeholder("ingredients.list");
export const validateCombo = placeholder("combo.validate");
export const priceCombo = placeholder("combo.price");

/* ADM only */
export const createDish        = placeholder('adm.createDish');
export const updateDish        = placeholder('adm.updateDish');
export const deleteDish        = placeholder('adm.deleteDish');

export const setDailySpecial   = placeholder('adm.setDailySpecial');
export const removeDailySpecial= placeholder('adm.removeDailySpecial');
