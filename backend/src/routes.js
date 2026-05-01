import { Router } from 'express';
import auth from './middleware/auth.js';
import adminOnly from "./middleware/adminOnly.js";

import * as authController  from './controllers/auth.controller.js';
import * as dishController  from './controllers/dish.controller.js';
import * as comboController from './controllers/combo.controller.js';
import * as orderController from './controllers/order.controller.js';
import * as userController  from './controllers/user.controller.js';
import * as cartController  from './controllers/cart.controller.js';
import * as paymentController from './controllers/payment.controller.js';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', auth, authController.logout);
router.post('/auth/refresh', auth, authController.refresh);

// ─────────────────────────────────────────────────────────────
// USER (authenticated)
// ─────────────────────────────────────────────────────────────

router.get('/users/me', auth, userController.getProfile);
router.delete('/users/me', auth, userController.deleteProfile);
router.patch('/users/me', auth, userController.updateProfile);

/* ADMIN only */
router.get('/users/:userId', auth, adminOnly, userController.getUserById);
router.get('/adm/customers', auth, adminOnly, userController.listCustomers);

// ─────────────────────────────────────────────────────────────────────────────
// DISHES MENU
// ─────────────────────────────────────────────────────────────────────────────

router.get('/dishes',               dishController.list);        // returns DishDTO[]
router.get('/dishes/daily-special', dishController.specials);    // returns DishDTO
//router.get("/dishes/:dish_id", dishController.get); // returns DishDTO

/* FAVORITES (cutomer logged) */
router.post('/dishes/:dish_id/favorite', auth, dishController.addFavorite);
router.delete('/dishes/:dish_id/favorite', auth, dishController.removeFavorite);
router.get('/dishes/favorites', auth, dishController.listFavorites);

/* ADMIN only */
router.post('/adm/dishes', auth, adminOnly, dishController.createDish);
router.patch('/adm/dishes/:id', auth, adminOnly, dishController.updateDish);
router.delete('/adm/dishes/:id', auth, adminOnly, dishController.deleteDish);

router.post('/adm/dishes/:id/special', auth, adminOnly, dishController.createDailySpecial);
router.patch('/adm/dishes/:id/special', auth, adminOnly, dishController.updateDailySpecial);
router.delete('/adm/dishes/:id/special', auth, adminOnly, dishController.deleteDailySpecial);

// ─────────────────────────────────────────────────────────────────────────────
// DISHES COMBO BUILDER  (used by custom orders)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/dishes/ingredients', comboController.listIngredients);
router.post('/dishes/combo/validate', comboController.validateCombo);
router.post('/dishes/combo/price', comboController.priceCombo);

/* ADMIN only */
router.post('/adm/ingredients', auth, adminOnly, comboController.createIngredient);
router.patch('/adm/ingredients/:id', auth, adminOnly, comboController.updateIngredient);
router.delete('/adm/ingredients/:id', auth, adminOnly, comboController.deleteIngredient);

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

/* LOGGED USER */
router.get('/orders/active', auth, orderController.getActive);
/* REAL TIME ORDER TRACKER STREAMER */
router.get('/orders/:id/stream', orderController.streamOrders);

/* ADMIN only */
router.get('/adm/orders/status/count', auth, adminOnly, orderController.statusCount);
router.patch('/adm/orders/:id/status', orderController.updateStatus);
router.get('/adm/orders/:id', auth, adminOnly, orderController.get);
router.get('/adm/orders', auth, adminOnly, orderController.list);
// remove create from front end access once cart is implemented:
router.post('/adm/orders', orderController.create);

// ─────────────────────────────────────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────────────────────────────────────
router.get('/cart', cartController.get);
router.patch('/cart', cartController.update);

/* PAYMENTS */
router.post('/payments/stripe', auth, paymentController.initiate);

export default router;
