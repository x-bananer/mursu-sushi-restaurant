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
 * GET /dishes/combo/ingredients
 * Get ingredients list for combo builder.
 */

/**
 * @typedef {Object} ComboIngredientsRequest
 */

/**
 * @typedef {Object} ComboIngredientsResponse
 * @property {Array<import('../dto/dish.type.js').IngredientDTO & { type: { id: number, type: string, name: string } | null }>} ingredients
 */

/**
 * POST /dishes/combo/preview
 * Validate custom combo and calculate total price.
 */

/**
 * @typedef {Object} ComboPreviewRequest
 * @property {Array<ComboPreviewIngredientData>} ingredients
 */

/**
 * @typedef {Object} ComboPreviewIngredientData
 * @property {number} ingredient_id
 * @property {number} quantity
 * @property {number} position
 */

/**
 * @typedef {Object} ComboPreviewResponse
 * @property {{ ingredients: Array<ComboPreviewIngredientData>, total_price: number }} combo
 */

/**
 * POST /dishes/combo/create
 * Create combo item and add it to cart.
 */

/**
 * @typedef {Object} ComboCreateRequest
 * @property {Array<ComboPreviewIngredientData>} ingredients
 */

/**
 * @typedef {Object} ComboCreateResponse
 * @property {import('../dto/cart.type.js').CartDTO} cart
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
