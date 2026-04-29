import { Router } from 'express';

import * as authController  from './controllers/auth.controller.js';
import * as dishController  from './controllers/dish.controller.js';
import * as comboController from './controllers/combo.controller.js'
import * as orderController from './controllers/order.controller.js';
import * as userController  from './controllers/user.controller.js';
import * as cartController  from './controllers/cart.controller.js';
import * as paymentController from './controllers/payment.controller.js';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

router.post('/auth/register', authController.register);
router.post('/auth/login',    authController.login);
router.post('/auth/logout',   authController.logout); // add authenticate later when implemented
router.post('/auth/refresh',  authController.refresh);

// ─────────────────────────────────────────────────────────────
// USER (authenticated)
// ─────────────────────────────────────────────────────────────

router.post('/users', userController.createProfile);
router.get('/users/me', userController.getProfile);        // UserDTO // add authenticate later when implemented
router.delete('/users/me', userController.deleteProfile);  // UserDTO // add authenticate later when implemented
router.patch('/users/me', userController.updateProfile);   // UserDTO // add authenticate later when implemented

/* ADMIN only */
router.get('/adm/customers', userController.listCustomers); // add authenticate and adminOnly later when implemented

// ─────────────────────────────────────────────────────────────────────────────
// DISHES MENU
// ─────────────────────────────────────────────────────────────────────────────

router.get('/dishes',               dishController.list);        // returns DishDTO[]
router.get('/dishes/daily-special', dishController.specials);    // returns DishDTO

/* FAVORITES (cutomer logged) */
router.post  ('/dishes/:dish_id/favorite',   dishController.addFavorite);     // add authenticate later when implemented
router.delete ('/dishes/:dish_id/favorite',  dishController.removeFavorite);  // add authenticate later when implemented
router.get    ('/dishes/favorites',          dishController.listFavorites);   // add authenticate later when implemented

/* ADMIN only */
router.post  ('/adm/dishes',     dishController.createDish); // add authenticate and adminOnly later when implemented
router.put   ('/adm/dishes/:id', dishController.updateDish); // add authenticate and adminOnly later when implemented
router.delete('/adm/dishes/:id', dishController.deleteDish); // add authenticate and adminOnly later when implemented

router.put   ('/adm/dishes/:id/special',   dishController.setDailySpecial); // add authenticate and adminOnly later when implemented
router.delete('/adm/dishes/:id/special',   dishController.removeDailySpecial); // add authenticate and adminOnly later when implemented

// ─────────────────────────────────────────────────────────────────────────────
// DISHES COMBO BUILDER  (used by custom orders)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/dishes/ingredients',     comboController.listIngredients);  // returns IngredientDTO[]
router.post('/dishes/combo/validate', comboController.validateCombo);    // From engie
router.post('/dishes/combo/price',    comboController.priceCombo);       // From engie

router.post  ('/adm/ingredients',     comboController.createIngredient); // add authenticate and adminOnly later when implemented
router.put   ('/adm/ingredients/:id', comboController.updateIngredient); // add authenticate and adminOnly later when implemented
router.delete('/adm/ingredients/:id', comboController.deleteIngredient); // add authenticate and adminOnly later when implemented


// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

/* LOGGED USER */
router.get('/orders/active',          orderController.getActive);
/* ANONYMOUS USER */
router.get('/orders/:id/tracking',    orderController.tracking);
/* REAL TIME ORDER TRACKER STREAMER */
router.get('/orders/:id/stream',      orderController.streamOrders);

/* ADMIN only */
router.get('/adm/orders/status/count', orderController.statusCount);  // add authenticate and adminOnly later when implemented
router.patch('/adm/orders/:id/status', orderController.updateStatus); // add authenticate and adminOnly later when implemented
router.get ('/adm/orders/:id',         orderController.get);          // add authenticate and adminOnly later when implemented
router.get('/adm/orders',              orderController.list);         // add authenticate and adminOnly later when implemented
// remove create from front end access once car is implemented:
router.post  ('/adm/orders',            orderController.create);

// ─────────────────────────────────────────────────────────────────────────────
// CART - Uses CartDTO
// ─────────────────────────────────────────────────────────────────────────────

router.get   ('/cart', cartController.get);     // GetCartResponse
router.patch ('/cart', cartController.update);  // UpdateCartResponse
router.post  ('/cart/checkout', cartController.checkout);

/* PAYMENTS */
router.post('/payments/stripe', paymentController.initiate);

export default router;
