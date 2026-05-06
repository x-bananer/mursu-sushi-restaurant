import argon2 from "argon2";
import * as userRepo from "../../models/db/repositories/user/user.repository.js";
import { t } from "../../i18n/messages.js";

const ARGON2_OPTIONS = {
	type: argon2.argon2id,
	memoryCost: 65536,
	timeCost: 3,
	parallelism: 1,
};

function createHttpError(statusCode, message) {
	const error = /** @type {Error & { statusCode: number }} */ (
		new Error(message)
	);
	error.statusCode = statusCode;
	return error;
}

function normalizeEntityId(value, locale, entityName) {
	const parsed = Number(value);

	if (!Number.isInteger(parsed) || parsed <= 0) {
		if (entityName === "user") {
			throw createHttpError(400, t(locale, "user", "valid_user_id_required"));
		}
		if (entityName === "order") {
			throw createHttpError(400, t(locale, "user", "valid_order_id_required"));
		}
		throw createHttpError(400, t(locale, "common", "internal_error"));
	}

	return parsed;
}

function normalizeUserId(userId, locale) {
	return normalizeEntityId(userId, locale, "user");
}

function normalizeOrderId(orderId, locale) {
	return normalizeEntityId(orderId, locale, "order");
}

function toPublicUser(user) {
	return {
		id: user.id,
		photo_url: user.photo_url ?? null,
		name: user.name,
		email: user.email,
		role_id: user.role_id,
		stamp_count: user.stamp_count,
		is_stamp_discount_active: user.is_stamp_discount_active,
		created_at: user.created_at,
	};
}

async function loadRequiredUser(normalizedUserId, locale) {
	const user = await userRepo.getUserById(normalizedUserId);

	if (!user) {
		throw createHttpError(404, t(locale, "user", "user_not_found"));
	}

	return user;
}

export async function getUserById(userId, locale) {
	const normalizedUserId = normalizeUserId(userId, locale);
	const user = await userRepo.getUserById(normalizedUserId);

	if (!user) {
		return null;
	}

	return toPublicUser(user);
}

export async function listUsers() {
	const users = await userRepo.listUsers();
	return users.map(toPublicUser);
}

export async function requireUserById(userId, locale) {
	const normalizedUserId = normalizeUserId(userId, locale);
	return loadRequiredUser(normalizedUserId, locale);
}

export async function assertUserExists(userId, locale) {
	const normalizedUserId = normalizeUserId(userId, locale);
	const exists = await userRepo.userExistsById(normalizedUserId);

	if (!exists) {
		throw createHttpError(404, t(locale, "user", "user_not_found"));
	}

	return true;
}

export async function getUserDiscountStateById(userId, locale) {
	const normalizedUserId = normalizeUserId(userId, locale);
	return userRepo.getUserDiscountStateById(normalizedUserId);
}

export async function assertUserOwnsOrder(userId, orderId, locale) {
	const normalizedUserId = normalizeUserId(userId, locale);
	const normalizedOrderId = normalizeOrderId(orderId, locale);
	const ownsOrder = await userRepo.userOwnsOrder(
		normalizedUserId,
		normalizedOrderId,
	);

	if (!ownsOrder) {
		throw createHttpError(403, t(locale, "user", "order_not_belong_to_user"));
	}

	return true;
}

export async function updateStampCount(userId, stampCount, locale) {
	const normalizedUserId = normalizeUserId(userId, locale);
	const normalizedStampCount = Number(stampCount);

	if (!Number.isInteger(normalizedStampCount) || normalizedStampCount < 0) {
		throw createHttpError(
			400,
			t(locale, "user", "stamp_count_non_negative_integer"),
		);
	}

	const user = await loadRequiredUser(normalizedUserId, locale);
	await userRepo.updateStampCount(normalizedUserId, normalizedStampCount);

	return toPublicUser({
		...user,
		stamp_count: normalizedStampCount,
	});
}

export async function incrementStampCount(userId, incrementBy = 1, locale) {
	const normalizedUserId = normalizeUserId(userId, locale);
	const normalizedIncrement = Number(incrementBy);

	if (!Number.isInteger(normalizedIncrement) || normalizedIncrement <= 0) {
		throw createHttpError(400, t(locale, "user", "increment_positive_integer"));
	}

	const user = await loadRequiredUser(normalizedUserId, locale);
	await userRepo.incrementStampCount(normalizedUserId, normalizedIncrement);

	return toPublicUser({
		...user,
		stamp_count: Number(user.stamp_count) + normalizedIncrement,
	});
}

export async function updateIsStampDiscountActive(userId, isActive, locale) {
	const normalizedUserId = normalizeUserId(userId, locale);

	if (typeof isActive !== "boolean") {
		throw createHttpError(400, t(locale, "user", "is_active_boolean"));
	}

	const user = await loadRequiredUser(normalizedUserId, locale);
	await userRepo.updateIsStampDiscountActive(normalizedUserId, isActive);

	return toPublicUser({
		...user,
		is_stamp_discount_active: isActive,
	});
}

export async function updateUserById(userId, data, locale) {
	const normalizedUserId = normalizeUserId(userId, locale);
	const payload = {};

	if (data?.name !== undefined) {
		const name = String(data.name).trim();
		if (!name) {
			throw createHttpError(400, t(locale, "user", "name_cannot_be_empty"));
		}
		payload.name = name;
	}

	if (data?.email !== undefined) {
		const email = String(data.email).trim().toLowerCase();
		if (!email) {
			throw createHttpError(400, t(locale, "user", "email_cannot_be_empty"));
		}
		payload.email = email;
	}

	if (data?.photo_url !== undefined) {
		if (data.photo_url !== null && typeof data.photo_url !== "string") {
			throw createHttpError(400, t(locale, "user", "photo_url_string_or_null"));
		}
		payload.photo_url = data.photo_url;
	}

	if (data?.password !== undefined) {
		const password = String(data.password);
		if (password.length < 8) {
			throw createHttpError(400, "Password must be at least 8 characters");
		}
		payload.password_hash = await argon2.hash(password, ARGON2_OPTIONS);
	}

	if (data?.role_id !== undefined) {
		const roleId = Number(data.role_id);
		if (!Number.isInteger(roleId) || roleId <= 0) {
			throw createHttpError(400, t(locale, "user", "role_id_positive_integer"));
		}
		payload.role_id = roleId;
	}

	if (data?.stamp_count !== undefined) {
		const stampCount = Number(data.stamp_count);
		if (!Number.isInteger(stampCount) || stampCount < 0) {
			throw createHttpError(400, t(locale, "user", "stamp_count_non_negative_integer"));
		}
		payload.stamp_count = stampCount;
	}

	if (data?.is_stamp_discount_active !== undefined) {
		if (typeof data.is_stamp_discount_active !== "boolean") {
			throw createHttpError(400, t(locale, "user", "is_stamp_discount_active_boolean"));
		}
		payload.is_stamp_discount_active = data.is_stamp_discount_active;
	}

	await loadRequiredUser(normalizedUserId, locale);
	await userRepo.updateUserById(normalizedUserId, payload);

	return getUserById(normalizedUserId, locale);
}

export async function updateOwnProfile(userId, data, locale) {
	if (
		data?.role_id !== undefined ||
		data?.stamp_count !== undefined ||
		data?.is_stamp_discount_active !== undefined
	) {
		throw createHttpError(
			403,
			t(locale, "user", "cannot_update_restricted_profile_fields"),
		);
	}

	return updateUserById(userId, {
		name: data?.name,
		email: data?.email,
		photo_url: data?.photo_url,
		password: data?.password,
	}, locale);
}

export async function deleteUserById(userId, locale) {
	const normalizedUserId = normalizeUserId(userId, locale);
	await loadRequiredUser(normalizedUserId, locale);

	try {
		await userRepo.deleteUserById(normalizedUserId);
	} catch (error) {
		if (error?.code === "ER_ROW_IS_REFERENCED_2") {
			throw createHttpError(
				409,
				t(locale, "user", "cannot_delete_user_with_related_records"),
			);
		}
		throw error;
	}

	return true;
}
