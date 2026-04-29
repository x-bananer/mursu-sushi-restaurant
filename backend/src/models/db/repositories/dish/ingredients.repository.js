import { select, execute } from "../../db.js";

/**
 * @typedef {import("../../../../../types/db/dish.type.js").Ingredients} Ingredients
 */

export async function getIngredients() {
    const rows = await select(
        `SELECT
        ingredients.id,
        ingredients.name,
        ingredients.ingredient_type_id,
        ingredients.price
        FROM ingredients`
    );

    return rows;
}

export async function getIngredientTypes() {
    const rows = await select(
        `SELECT
        ingredient_type.id,
        ingredient_type.type,
        ingredient_type.name
        FROM ingredient_type`
    );

    return rows;
}
