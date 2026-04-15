import { Router } from 'express';

import * as authController  from './controllers/auth.controller.js';
import * as dishController  from './controllers/dish.controller.js';
import * as orderController from './controllers/order.controller.js';
import * as userController  from './controllers/user.controller.js';
import * as adminController from './controllers/admin.controller.js';
import * as cartController from './controllers/cart.controller.js';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

router.post('/auth/register', authController.register);
router.post('/auth/login',    authController.login);
router.post('/auth/logout',   authController.logout); // add authenticate later when implemented
router.get ('/auth/user',       authController.me);     // add authenticate later when implemented
router.post('/auth/refresh',  authController.refresh);

// ─────────────────────────────────────────────────────────────────────────────
// DISHES (Menu) - Uses DishDTO (public)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/dishes',          dishController.list);        // returns DishDTO[]
router.get('/dishes/:id',      dishController.get);         // returns DishDTO
router.get('/dishes/daily-special', dishController.specials);    // returns DishDTO

// ─────────────────────────────────────────────────────────────────────────────
// COMBO BUILDER  (used by custom orders)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/ingredients', dishController.listIngredients);          // returns IngredientDTO[]
router.post('/dishes/combo/validate', dishController.validateCombo); // From engie
router.post('/dishes/combo/price',    dishController.priceCombo);    // From engie

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS - Uses OrderDTO
// ─────────────────────────────────────────────────────────────────────────────

router.get   ('/orders',              orderController.list);      // OrderDTO[]
router.get   ('/orders/:id',          orderController.get);       // OrderDTO
router.post  ('/orders',              orderController.create);    // OrderDTO

router.delete('/orders/:id',          orderController.cancelOrder);

router.get   ('/orders/:id/tracking', orderController.tracking);

// ─────────────────────────────────────────────────────────────────────────────
// CART - Uses CartDTO
// ─────────────────────────────────────────────────────────────────────────────

router.get   ('/cart', cartController.get);     // GetCartResponse
router.post  ('/cart', cartController.create);  // CreateCartResponse
router.patch ('/cart', cartController.update);  // UpdateCartResponse

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────────────────────

router.post('/orders/:id/payments/mobilepay',         orderController.initiatePayment);
router.post('/orders/:id/payments/mobilepay/confirm', orderController.confirmPayment);
router.get ('/orders/:id/payments/status',            orderController.paymentStatus);

// ─────────────────────────────────────────────────────────────
// USER (uses UserDTO) (authenticated)
// ─────────────────────────────────────────────────────────────

router.get('/users/me', userController.getProfile);        // UserDTO // add authenticate later when implemented
router.put('/users/me', userController.updateProfile);     // UserDTO // add authenticate later when implemented

/* Rewards system (based on DTO fields) */
router.get('/users/me/rewards', userController.getRewards);   // add authenticate later when implemented
router.get('/users/me/stamps',  userController.getStamps);    // add authenticate later when implemented

/* FAVORITES (based on DishDTO.is_favorite) - here user must be authenticated*/
router.post  ('/users/favorites/:dish_id',   dishController.addFavorite);     // add authenticate later when implemented
router.delete ('/users/favorites/:dish_id',  dishController.removeFavorite);  // add authenticate later when implemented
router.get    ('/users/favorites',           dishController.listFavorites);   // add authenticate later when implemented

// ─────────────────────────────────────────────────────────────
// ADMIN (uses DTOs internally) (authenticated + admin role)
// ─────────────────────────────────────────────────────────────

/* Dashboard */
router.get('/admin/stats', adminController.stats); // add authenticate and adminOnly later when implemented

/* Orders */
router.get('/admin/orders',            adminController.listOrders);  // add authenticate and adminOnly later when implemented
router.put('/admin/orders/:id/status', adminController.updateOrderStatus); // add authenticate and adminOnly later when implemented

/* Users */
router.get('/admin/customers', adminController.listCustomers); // add authenticate and adminOnly later when implemented

/* Dishes CRUD */
router.post  ('/admin/dishes',     adminController.createDish); // add authenticate and adminOnly later when implemented
router.put   ('/admin/dishes/:id', adminController.updateDish); // add authenticate and adminOnly later when implemented
router.delete('/admin/dishes/:id', adminController.deleteDish); // add authenticate and adminOnly later when implemented

/* Specials */
router.put   ('/admin/dishes/:id/special',   adminController.setDailySpecial); // add authenticate and adminOnly later when implemented
router.delete('/admin/dishes/:id/special',   adminController.removeDailySpecial); // add authenticate and adminOnly later when implemented

router.post  ('/admin/ingredients',     adminController.createIngredient); // add authenticate and adminOnly later when implemented
router.put   ('/admin/ingredients/:id', adminController.updateIngredient); // add authenticate and adminOnly later when implemented
router.delete('/admin/ingredients/:id', adminController.deleteIngredient); // add authenticate and adminOnly later when implemented

export default router;
