import * as userService from "../services/user/user.service.js";
import { placeholder } from "../utils/paceholder.js";

export async function getMe(req, res, next) {
	try {
		const user = await userService.getUserById(req.user.id);

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		res.json({ user });
	} catch (error) {
		next(error);
	}
}

export async function getUserById(req, res, next) {
	try {
		const user = await userService.getUserById(req.params.userId);

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		res.json({ user });
	} catch (error) {
		next(error);
	}
}

export async function setStampCount(req, res, next) {
	try {
		const user = await userService.updateStampCount(
			req.params.userId,
			req.body?.stampCount,
		);
		res.json({ user });
	} catch (error) {
		next(error);
	}
}

export async function addStamp(req, res, next) {
	try {
		let incrementBy = 1;

		if (req.body && req.body.incrementBy !== undefined) {
			incrementBy = req.body.incrementBy;
		}

		const user = await userService.incrementStampCount(
			req.params.userId,
			incrementBy,
		);
		res.json({ user });
	} catch (error) {
		next(error);
	}
}

export async function setStampDiscountActive(req, res, next) {
	try {
		const user = await userService.updateIsStampDiscountActive(
			req.params.userId,
			req.body?.isActive,
		);
		res.json({ user });
	} catch (error) {
		next(error);
	}
}

export async function getProfile(req, res, next) {
	return getMe(req, res, next);
}

export const updateProfile = placeholder("users.updateProfile");
