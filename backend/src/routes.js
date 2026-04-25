import { Router } from "express";
import auth from "./middleware/auth.js";
import adminOnly from "./middleware/adminOnly.js";

import * as authController from "./controllers/auth.controller.js";
import * as dishController from "./controllers/dish.controller.js";
import * as orderController from "./controllers/order.controller.js";
import * as userController from "./controllers/user.controller.js";
import * as adminController from "./controllers/admin.controller.js";
import * as cartController from "./controllers/cart.controller.js";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);
router.post("/auth/refresh", authController.refresh);

// ─────────────────────────────────────────────────────────────────────────────
// DISHES (Menu) - Uses DishDTO (public)
// ─────────────────────────────────────────────────────────────────────────────

router.get("/dishes", dishController.list);
router.get("/dishes/:dish_id", dishController.get);
router.get("/dishes/daily-special", dishController.specials);

/* FAVORITES (based on DishDTO.is_favorite) - here user must be authenticated*/
router.post("/dishes/:dish_id/favorite", dishController.addFavorite);
router.delete("/dishes/:dish_id/favorite", dishController.removeFavorite);
router.get("/dishes/favorites", dishController.listFavorites);

// ─────────────────────────────────────────────────────────────────────────────
// COMBO BUILDER  (used by custom orders)
// ─────────────────────────────────────────────────────────────────────────────

router.get("/dishes/ingredients", dishController.listIngredients);
router.post("/dishes/combo/validate", dishController.validateCombo);
router.post("/dishes/combo/price", dishController.priceCombo);

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS - Uses OrderDTO
// ─────────────────────────────────────────────────────────────────────────────

// SPECIFIC FIRST
router.get("/orders/active", orderController.getActive);
router.get("/orders/stats", orderController.stats);

router.get("/orders/:id/tracking", orderController.tracking);
router.patch("/orders/:id/status", orderController.updateStatus);
router.get("/orders/:id/stream", orderController.streamOrders);
// Then more general
router.get("/orders", orderController.list);
router.get("/orders/:id", orderController.get);
router.get("/orders/active", orderController.getActive);
// remove create from front end access once car is implemented:
router.post("/orders", orderController.create);

// ─────────────────────────────────────────────────────────────────────────────
// CART - Uses CartDTO
// ─────────────────────────────────────────────────────────────────────────────

router.get("/cart", cartController.get);
router.post("/cart", cartController.create);
router.patch("/cart", cartController.update);

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────────────────────

router.post("/orders/:id/payments/mobilepay", orderController.initiatePayment);
router.post(
	"/orders/:id/payments/mobilepay/confirm",
	orderController.confirmPayment,
);
router.get("/orders/:id/payments/status", orderController.paymentStatus);

// ─────────────────────────────────────────────────────────────
// USER (uses UserDTO) (authenticated)
// ─────────────────────────────────────────────────────────────

router.get("/users/me", auth, userController.getMe);
router.put("/users/me", auth, userController.updateProfile);
router.get("/users/:userId", auth, adminOnly, userController.getUserById);
router.patch(
	"/users/:userId/stamps",
	auth,
	adminOnly,
	userController.setStampCount,
);
router.post(
	"/users/:userId/stamps/increment",
	auth,
	adminOnly,
	userController.addStamp,
);
router.patch(
	"/users/:userId/stamp-discount",
	auth,
	adminOnly,
	userController.setStampDiscountActive,
);

// ─────────────────────────────────────────────────────────────
// ADMIN (uses DTOs internally) (authenticated + admin role)
// ─────────────────────────────────────────────────────────────

/* Dashboard */
router.get("/admin/stats", adminController.stats);

/* Orders */
router.get("/admin/orders", adminController.listOrders);
router.put("/admin/orders/:id/status", adminController.updateOrderStatus);

/* Users */
router.get("/admin/customers", adminController.listCustomers);

/* Dishes CRUD */
router.post("/admin/dishes", adminController.createDish);
router.put("/admin/dishes/:id", adminController.updateDish);
router.delete("/admin/dishes/:id", adminController.deleteDish);

/* Specials */
router.put("/admin/dishes/:id/special", adminController.setDailySpecial);
router.delete("/admin/dishes/:id/special", adminController.removeDailySpecial);

router.post("/admin/ingredients", adminController.createIngredient);
router.put("/admin/ingredients/:id", adminController.updateIngredient);
router.delete("/admin/ingredients/:id", adminController.deleteIngredient);

export default router;
