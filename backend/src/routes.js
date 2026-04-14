import { Router } from 'express';

import * as authController  from './controllers/auth.controller.js';
import * as dishController  from './controllers/dish.controller.js';
import * as orderController from './controllers/order.controller.js';
import * as userController  from './controllers/user.controller.js';
import * as adminController from './controllers/admin.controller.js';

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────

router.post('/auth/register', authController.register);
router.post('/auth/login',    authController.login);
router.post('/auth/logout',   authController.logout); // add authenticate later when implemented
router.post('/auth/refresh',  authController.refresh);
router.get ('/auth/me',       authController.me);  // add authenticate later when implemented

// ─────────────────────────────────────────────────────────────────────────────
// DISHES  (public)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/dishes',          dishController.list);
router.get('/dishes/specials', dishController.specials);
router.get('/dishes/:id',      dishController.get);

// ─────────────────────────────────────────────────────────────────────────────
// FAVORITES  (authenticated)
// ─────────────────────────────────────────────────────────────────────────────

router.get   ('/dishes/favorites',      dishController.listFavorites); // add authenticate later when implemented
router.post  ('/dishes/:id/favorite',   dishController.addFavorite);    // add authenticate later when implemented
router.delete('/dishes/:id/favorite',   dishController.removeFavorite);  // add authenticate later when implemented

// ─────────────────────────────────────────────────────────────────────────────
// COMBO BUILDER  (public read, authenticated submit)
// ─────────────────────────────────────────────────────────────────────────────

router.get ('/ingredients',    dishController.listIngredients);
router.post('/combo/validate', dishController.validateCombo);
router.post('/combo/price',    dishController.priceCombo);

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS  (authenticated)
// ─────────────────────────────────────────────────────────────────────────────

router.get   ('/orders',              orderController.list);  // add authenticate later when implemented
router.get   ('/orders/:id',          orderController.get);    // add authenticate later when implemented
router.post  ('/orders',              orderController.create);  // add authenticate later when implemented
router.delete('/orders/:id',          orderController.cancel);  // add authenticate later when implemented
router.get   ('/orders/:id/tracking', orderController.tracking); // add authenticate later when implemented
router.get   ('/orders/:id/journey',  orderController.journey);  // add authenticate later when implemented

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────────────────────

router.post('/payments/mobilepay',         orderController.initiatePayment);  // add authenticate later when implemented
router.post('/payments/mobilepay/confirm', orderController.confirmPayment);
router.get ('/payments/:orderId/status',   orderController.paymentStatus);  // add authenticate later when implemented

// ─────────────────────────────────────────────────────────────────────────────
// USER PROFILE  (authenticated)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/users/me',          userController.getProfile);   // add authenticate later when implemented
router.put('/users/me',          userController.updateProfile); // add authenticate later when implemented
router.get('/users/me/rewards',  userController.getRewards);  // add authenticate later when implemented
router.get('/users/me/stamps',   userController.getStamps);  // add authenticate later when implemented

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN  (authenticated + admin role)
// ─────────────────────────────────────────────────────────────────────────────

router.get   ('/admin/stats',                 adminController.stats); // add authenticate and adminOnly later when implemented

router.get   ('/admin/orders',                adminController.listOrders); // add authenticate and adminOnly later when implemented
router.put   ('/admin/orders/:id/status',     adminController.updateOrderStatus); // add authenticate and adminOnly later when implemented

router.get   ('/admin/customers',             adminController.listCustomers); // add authenticate and adminOnly later when implemented

router.post  ('/admin/dishes',                adminController.createDish); // add authenticate and adminOnly later when implemented
router.put   ('/admin/dishes/:id',            adminController.updateDish); // add authenticate and adminOnly later when implemented
router.delete('/admin/dishes/:id',            adminController.deleteDish); // add authenticate and adminOnly later when implemented
router.put   ('/admin/dishes/:id/special',    adminController.setDailySpecial); // add authenticate and adminOnly later when implemented
router.delete('/admin/dishes/:id/special',    adminController.removeDailySpecial); // add authenticate and adminOnly later when implemented

router.post  ('/admin/ingredients',           adminController.createIngredient); // add authenticate and adminOnly later when implemented
router.put   ('/admin/ingredients/:id',       adminController.updateIngredient); // add authenticate and adminOnly later when implemented
router.delete('/admin/ingredients/:id',       adminController.deleteIngredient); // add authenticate and adminOnly later when implemented

export default router;
