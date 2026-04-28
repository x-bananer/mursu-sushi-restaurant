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

export const listFavorites = placeholder("dishes.listFavorites");
export const addFavorite = placeholder("dishes.addFavorite");
export const removeFavorite = placeholder("dishes.removeFavorite");

export const listIngredients = placeholder("ingredients.list");
export const validateCombo = placeholder("combo.validate");
export const priceCombo = placeholder("combo.price");
