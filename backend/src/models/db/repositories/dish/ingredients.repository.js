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

export async function getIngredientById(id) {
    const rows = await select(
        `SELECT
        ingredients.id,
        ingredients.name,
        ingredients.ingredient_type_id,
        ingredients.price
        FROM ingredients
        WHERE ingredients.id = ?`,
        [id]
    );

    return rows[0] || null;
}

export async function createIngredient({ name, price, ingredient_type_id }) {
    const result = await execute(
        `INSERT INTO ingredients (name, price, ingredient_type_id)
        VALUES (?, ?, ?)`,
        [name, price, ingredient_type_id]
    );

    return result.insertId || null;
}

export async function updateIngredientById(id, updates = {}) {
    const updatingFields = [];
    const params = [];

    if (updates.name !== undefined) {
        updatingFields.push("name = ?");
        params.push(updates.name);
    }

    if (updates.price !== undefined) {
        updatingFields.push("price = ?");
        params.push(updates.price);
    }

    if (updates.ingredient_type_id !== undefined) {
        updatingFields.push("ingredient_type_id = ?");
        params.push(updates.ingredient_type_id);
    }

    if (updatingFields.length === 0) {
        return 0;
    }

    params.push(id);

    const result = await execute(
        `UPDATE ingredients
        SET ${updatingFields.join(", ")}
        WHERE id = ?`,
        params
    );

    return result.affectedRows || 0;
}

export async function deleteIngredientById(id) {
    const result = await execute(
        `DELETE FROM ingredients
        WHERE id = ?`,
        [id]
    );

    return result.affectedRows || 0;
}
