import { Router } from "express";
import auth from "./middleware/auth.js";
import adminOnly from "./middleware/adminOnly.js";
import * as authController from "./controllers/auth.controller.js";
import * as userController from "./controllers/user.controller.js";

const router = Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

router.get("/users/me", auth, userController.getMe);

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

export default router;
