import { placeholder } from '../utils/paceholder.js';

/**
 * @api {get} /api/v1/adm/customers List customers (placeholder)
 * @apiName AdminListCustomersPlaceholder
 * @apiGroup AdminPlaceholders
 */
export const listCustomers     = placeholder('admin.listCustomers');



/**
 * @api {post} /api/v1/adm/ingredients Create ingredient (placeholder)
 * @apiName AdminCreateIngredientPlaceholder
 * @apiGroup AdminPlaceholders
 */
export const createIngredient  = placeholder('admin.createIngredient');
/**
 * @api {patch} /api/v1/adm/ingredients/:id Update ingredient (placeholder)
 * @apiName AdminUpdateIngredientPlaceholder
 * @apiGroup AdminPlaceholders
 */
export const updateIngredient  = placeholder('admin.updateIngredient');
/**
 * @api {delete} /api/v1/adm/ingredients/:id Delete ingredient (placeholder)
 * @apiName AdminDeleteIngredientPlaceholder
 * @apiGroup AdminPlaceholders
 */
export const deleteIngredient  = placeholder('admin.deleteIngredient');
