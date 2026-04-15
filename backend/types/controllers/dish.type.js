/**
 * GET /dishes
 * Get menu dishes list
 */

/**
 * @typedef {Object} DishesRequest
 */

/**
 * @typedef {Object} DishesResponse
 * @property {Array<import('../dto/dish.type.js').DishDTO>} dishes
 */

/**
 * GET /dishes/daily-special
 * Get current daily special dish
 */

/**
 * @typedef {Object} DailySpecialRequest
 */

/**
 * @typedef {Object} DailySpecialResponse
 * @property {import('../dto/dish.type.js').DishDTO | null} dish
 */

/**
 * POST /dishes/combo/validate
 * Validate custom combo ingredients against combo builder rules
 */

/**
 * @typedef {Object} ValidateComboRequest
 * @property {Array<ValidateComboIngredientData>} ingredients
 */

/**
 * @typedef {Object} ValidateComboIngredientData
 * @property {number} ingredient_id
 * @property {number} quantity
 * @property {number} position
 */

/**
 * @typedef {Object} ValidateComboResponse
 * @property {boolean} success
 */

/**
 * POST /dishes/combo/price
 * Calculate price for custom combo ingredients
 */

/**
 * @typedef {Object} ComboPriceRequest
 * @property {Array<ComboPriceIngredientData>} ingredients
 */

/**
 * @typedef {Object} ComboPriceIngredientData
 * @property {number} ingredient_id
 * @property {number} quantity
 * @property {number} position
 */

/**
 * @typedef {Object} ComboPriceResponse
 * @property {number} price
 */

/**
 * POST /dishes/:dish_id/favorite
 * Add dish to current user favorites
 */

/**
 * @typedef {Object} AddFavoriteDishRequest
 * @property {number} dish_id
 */

/**
 * @typedef {Object} AddFavoriteDishResponse
 * @property {boolean} success
 */

/**
 * DELETE /dishes/:dish_id/favorite
 * Remove dish from current user favorites
 */

/**
 * @typedef {Object} RemoveFavoriteDishRequest
 * @property {number} dish_id
 */

/**
 * @typedef {Object} RemoveFavoriteDishResponse
 * @property {boolean} success
 */
