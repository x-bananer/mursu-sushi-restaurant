import * as userService from "../services/user/user.service.js";
import { t } from "../i18n/messages.js";

function getPayloadWithPhoto(req) {
	if (!req.file) {
		return req.body;
	}

	return {
		...req.body,
		photo_url: `${req.protocol}://${req.get("host")}/uploads/users/${req.file.filename}`,
	};
}

/**
 * @api {get} /api/v1/users/me Get own profile
 * @apiName GetProfile
 * @apiGroup Users
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiSuccess {Object} user User profile.
 */
export async function getProfile(req, res, next) {
	try {
		const user = await userService.getUserById(req.user.id, req.locale);

		if (!user) {
			res.status(404).json({ message: t(req.locale, "user", "user_not_found") });
			return;
		}

		res.json({ user });
	} catch (error) {
		next(error);
	}
}

/**
 * @api {delete} /api/v1/users/me Delete own profile
 * @apiName DeleteProfile
 * @apiGroup Users
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiSuccess (204) NoContent Deleted.
 */
export async function deleteProfile(req, res, next) {
	try {
		await userService.deleteUserById(req.user.id, req.locale);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
}

/**
 * @api {patch} /api/v1/users/me Update own profile
 * @apiName UpdateProfile
 * @apiGroup Users
 * @apiHeader {String} Authorization Bearer JWT token.
 * @apiSuccess {Object} user Updated profile.
 */
export async function updateProfile(req, res, next) {
	try {
		const user = await userService.updateOwnProfile(
			req.user.id,
			getPayloadWithPhoto(req),
			req.locale,
		);
		res.json({ user });
	} catch (error) {
		next(error);
	}
}

/**
 * @api {get} /api/v1/adm/customers List customers
 * @apiName ListCustomers
 * @apiGroup UsersAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiSuccess {Object[]} users Customer list.
 */
export async function listCustomers(req, res, next) {
	try {
		const users = await userService.listUsers();
		res.json({ users });
	} catch (error) {
		next(error);
	}
}

/**
 * @api {get} /api/v1/adm/users/:userId Get user by id
 * @apiName GetUserById
 * @apiGroup UsersAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} userId User id.
 * @apiSuccess {Object} user User profile.
 */
export async function getUserById(req, res, next) {
	try {
		const localizedUser = await userService.getUserById(req.params.userId, req.locale);

		if (!localizedUser) {
			res.status(404).json({ message: t(req.locale, "user", "user_not_found") });
			return;
		}

		res.json({ user: localizedUser });
	} catch (error) {
		next(error);
	}
}

/**
 * @api {patch} /api/v1/adm/users/:userId Update user by id
 * @apiName UpdateUserById
 * @apiGroup UsersAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} userId User id.
 * @apiSuccess {Object} user Updated user.
 */
export async function updateUserById(req, res, next) {
	try {
		const user = await userService.updateUserById(
			req.params.userId,
			getPayloadWithPhoto(req),
			req.locale,
		);
		res.json({ user });
	} catch (error) {
		next(error);
	}
}

/**
 * @api {patch} /api/v1/adm/users/:userId/stamps Set stamp count
 * @apiName SetStampCount
 * @apiGroup UsersAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} userId User id.
 * @apiSuccess {Object} user Updated user.
 */
export async function setStampCount(req, res, next) {
	try {
		const user = await userService.updateStampCount(
			req.params.userId,
			req.body?.stampCount,
			req.locale,
		);
		res.json({ user });
	} catch (error) {
		next(error);
	}
}

/**
 * @api {post} /api/v1/adm/users/:userId/stamps Add stamp
 * @apiName AddStamp
 * @apiGroup UsersAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} userId User id.
 * @apiSuccess {Object} user Updated user.
 */
export async function addStamp(req, res, next) {
	try {
		let incrementBy = 1;

		if (req.body && req.body.incrementBy !== undefined) {
			incrementBy = req.body.incrementBy;
		}

		const user = await userService.incrementStampCount(
			req.params.userId,
			incrementBy,
			req.locale,
		);
		res.json({ user });
	} catch (error) {
		next(error);
	}
}

/**
 * @api {patch} /api/v1/adm/users/:userId/stamp-discount Set stamp discount active
 * @apiName SetStampDiscountActive
 * @apiGroup UsersAdmin
 * @apiHeader {String} Authorization Bearer JWT token (admin).
 * @apiParam {Number} userId User id.
 * @apiSuccess {Object} user Updated user.
 */
export async function setStampDiscountActive(req, res, next) {
	try {
		const user = await userService.updateIsStampDiscountActive(
			req.params.userId,
			req.body?.isActive,
			req.locale,
		);
		res.json({ user });
	} catch (error) {
		next(error);
	}
}
