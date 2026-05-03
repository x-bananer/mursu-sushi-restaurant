export function buildCombo(ingredientsFromClient, ingredientsFromDb, withValidation = false) {
    const ingredients = [...ingredientsFromClient].sort((a, b) => Number(a.position) - Number(b.position));

    if (withValidation) {
        validateRequiredFields(ingredients);
        validateIngredientsExist(ingredients, ingredientsFromDb);
        validateItemsQuantity(ingredients, ingredientsFromDb);
        validateItemsOrder(ingredients, ingredientsFromDb);
    }

    const totalPrice = calculateComboPrice(ingredients, ingredientsFromDb);

    return {
        ingredients,
        total_price: totalPrice,
    };
}

function validateRequiredFields(ingredientsFromClient) {
    if (!Array.isArray(ingredientsFromClient) || !ingredientsFromClient.length) {
        throw new Error('Ingredients required');
    }

    for (const clientItem of ingredientsFromClient) {
        if (!clientItem.ingredient_id) {
            throw new Error('Each ingredient id required');
        }

        if (!clientItem.quantity || Number(clientItem.quantity) <= 0) {
            throw new Error('Each ingredient quantity must be > 0');
        }

        if (!clientItem.position || Number(clientItem.position) <= 0) {
            throw new Error('Each ingredient position must be > 0');
        }
    }
}

function validateIngredientsExist(ingredientsFromClient, ingredientsFromDb) {
    for (const clientItem of ingredientsFromClient) {
        const dbIngredient = ingredientsFromDb.find(dbItem => dbItem.id === clientItem.ingredient_id);

        if (!dbIngredient) {
            throw new Error(`Ingredient #${clientItem.id} not found`);
        }
    }
}

function validateItemsQuantity(sortedIngredientsFromClient, ingredientsFromDb) {
    const comboOrderError = 'Invalid combo order: base must be at the bottom (exactly 1 required), fillings in the middle (max 3), toppings on top (max 3).';
    let baseCount = 0;
    let fillingCount = 0;
    let toppingCount = 0;

    for (const clientIngredient of sortedIngredientsFromClient) {
        const dbIngredient = ingredientsFromDb.find(dbIngredient => Number(dbIngredient.id) === Number(clientIngredient.ingredient_id));

        const ingredientTypeId = Number(dbIngredient.ingredient_type_id);

        if (ingredientTypeId === 1) {
            baseCount += 1;
        } else if (ingredientTypeId === 2) {
            fillingCount += 1;
        } else if (ingredientTypeId === 3) {
            toppingCount += 1;
        }

        if (baseCount > 1) {
            throw new Error(comboOrderError);
        }

        if (fillingCount > 3) {
            throw new Error(comboOrderError);
        }

        if (toppingCount > 3) {
            throw new Error(comboOrderError);
        }
    }

    if (!baseCount) {
        throw new Error(comboOrderError);
    }
}

function validateItemsOrder(sortedIngredientsFromClient, ingredientsFromDb) {
    const comboOrderError = 'Invalid combo order: base must be at the bottom (exactly 1 required), fillings in the middle (max 3), toppings on top (max 3).';
    const firstIngredient = sortedIngredientsFromClient[0];
    const lastIngredient = sortedIngredientsFromClient[sortedIngredientsFromClient.length - 1];

    const firstDbIngredient = ingredientsFromDb.find(dbIngredient => {
        return Number(dbIngredient.id) === Number(firstIngredient.ingredient_id);
    });

    const lastDbIngredient = ingredientsFromDb.find(dbIngredient => {
        return Number(dbIngredient.id) === Number(lastIngredient.ingredient_id);
    });

    const firstTypeId = Number(firstDbIngredient.ingredient_type_id);
    const lastTypeId = Number(lastDbIngredient.ingredient_type_id);

    if (firstTypeId !== 1) {
        // base must be at the bottom
        throw new Error(comboOrderError);
    }

    if (lastTypeId !== 3) {
        // topping must be at the top
        throw new Error(comboOrderError);
    }
}

function calculateComboPrice(ingredientsFromClient, ingredientsFromDb) {
    let totalPrice = 0;

    for (const clientItem of ingredientsFromClient) {
        const dbIngredient = ingredientsFromDb.find(dbItem => dbItem.id === clientItem.ingredient_id);
        totalPrice += Number(dbIngredient.price) * Number(clientItem.quantity);
    }

    return totalPrice;
}
