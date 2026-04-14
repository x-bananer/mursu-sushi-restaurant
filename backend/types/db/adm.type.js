/**
 * ── Adm-related tables ───────────────────────────────────────────────────────
 *
 * Note: Admin queries are mostly aggregations and joins across existing tables
 * (orders, users, dishes). There are no admin-exclusive tables in the schema.
 * These types represent the shapes that come back from those aggregation queries
 * — they are not raw single-table rows like the other db types.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Returned by the dashboard stats aggregation query.
 * All four values come from a single CTE query against the orders table.
 * Used by admin.controller.js to build DashboardStatsResponse DTO.
 *
 * @typedef {Object} AdminDashboardStats
 * @property {number} orders_today    — count of orders created since midnight
 * @property {number} revenue_today   — sum of total_price for today's orders
 * @property {number} pending_count   — orders with status 'pending' right now
 * @property {number} ready_count     — orders with status 'ready' right now
 */

/**
 * Returned by the admin order list query.
 * Joins orders + users + order_statuses + delivery_types in one query.
 * Richer than the customer-facing order row — includes customer name
 * and readable status/delivery strings for the adm kanban board display.
 *
 * @typedef {Object} AdminOrderRow
 * @property {number}      id
 * @property {number|null} user_id
 * @property {string|null} user_name          — joined from users.name, null for guest orders
 * @property {number}      status_id
 * @property {string}      status_name        — joined from order_statuses.name
 * @property {number}      delivery_type_id
 * @property {string}      delivery_type_name — joined from delivery_types.name
 * @property {boolean}     is_paid
 * @property {string|null} address
 * @property {string|null} notes
 * @property {number}      total_price
 * @property {Date}        created_at
 * @property {Date}        updated_at
 */

/**
 * Returned by the admin customer list query.
 * Joins users + user_roles and includes aggregate order stats per user.
 * Used by admin.controller.js to build the Customers section.
 *
 * @typedef {Object} AdminCustomers
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} role_name           — joined from user_roles.name
 * @property {number} stamp_count
 * @property {number} reward_points
 * @property {number} total_orders        — aggregated count of all orders by this user
 * @property {number} total_spent         — aggregated sum of all order totals
 * @property {Date}   created_at
 */

/**
 * Returned by the admin dish list query.
 * Joins dishes + badges and includes availability and special status.
 * Used by the admin Menu Editor section.
 *
 * @typedef {Object} AdminDishes
 * @property {number}   id
 * @property {string}   name
 * @property {number}   price
 * @property {boolean}  is_available
 * @property {boolean}  is_daily_special  — true if a daily_specials row exists for today
 * @property {string}   badge_ids         — comma-separated badge ids
 * @property {string}   badge_names       — comma-separated badge names
 * @property {Date}     created_at
 */
