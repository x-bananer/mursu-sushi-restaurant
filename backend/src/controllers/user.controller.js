import * as userService from "../services/user/user.service.js";

function getPayloadWithPhoto(req) {
	if (!req.file) {
		return req.body;
	}

	return {
		...req.body,
		photo_url: `${req.protocol}://${req.get("host")}/uploads/users/${req.file.filename}`,
	};
}

export async function getProfile(req, res, next) {
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

export async function deleteProfile(req, res, next) {
	try {
		await userService.deleteUserById(req.user.id);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
}
export async function updateProfile(req, res, next) {
	try {
		const user = await userService.updateOwnProfile(
			req.user.id,
			getPayloadWithPhoto(req),
		);
		res.json({ user });
	} catch (error) {
		next(error);
	}
}

/* ADMIN only */
export async function listCustomers(req, res, next) {
	try {
		const users = await userService.listUsers();
		res.json({ users });
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

export async function updateUserById(req, res, next) {
	try {
		const user = await userService.updateUserById(
			req.params.userId,
			getPayloadWithPhoto(req),
		);
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
