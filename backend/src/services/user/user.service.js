import * as userRepo from "../../models/db/repositories/user/user.repository.js";

function createHttpError(statusCode, message) {
	const error = /** @type {Error & { statusCode: number }} */ (
		new Error(message)
	);
	error.statusCode = statusCode;
	return error;
}

function normalizeEntityId(value, entityName) {
	const parsed = Number(value);

	if (!Number.isInteger(parsed) || parsed <= 0) {
		throw createHttpError(400, `Valid ${entityName} id is required`);
	}

	return parsed;
}

function normalizeUserId(userId) {
	return normalizeEntityId(userId, "user");
}

function normalizeOrderId(orderId) {
	return normalizeEntityId(orderId, "order");
}

function toPublicUser(user) {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role_id: user.role_id,
		stamp_count: user.stamp_count,
		is_stamp_discount_active: user.is_stamp_discount_active,
	};
}

async function loadRequiredUser(normalizedUserId) {
	const user = await userRepo.getUserById(normalizedUserId);

	if (!user) {
		throw createHttpError(404, "User not found");
	}

	return user;
}

export async function getUserById(userId) {
	const normalizedUserId = normalizeUserId(userId);
	const user = await userRepo.getUserById(normalizedUserId);

	if (!user) {
		return null;
	}

	return toPublicUser(user);
}

export async function requireUserById(userId) {
	const normalizedUserId = normalizeUserId(userId);
	return loadRequiredUser(normalizedUserId);
}

export async function assertUserExists(userId) {
	const normalizedUserId = normalizeUserId(userId);
	const exists = await userRepo.userExistsById(normalizedUserId);

	if (!exists) {
		throw createHttpError(404, "User not found");
	}

	return true;
}

export async function getUserDiscountStateById(userId) {
	const normalizedUserId = normalizeUserId(userId);
	return userRepo.getUserDiscountStateById(normalizedUserId);
}

export async function assertUserOwnsOrder(userId, orderId) {
	const normalizedUserId = normalizeUserId(userId);
	const normalizedOrderId = normalizeOrderId(orderId);
	const ownsOrder = await userRepo.userOwnsOrder(
		normalizedUserId,
		normalizedOrderId,
	);

	if (!ownsOrder) {
		throw createHttpError(403, "Order does not belong to user");
	}

	return true;
}

export async function updateStampCount(userId, stampCount) {
	const normalizedUserId = normalizeUserId(userId);
	const normalizedStampCount = Number(stampCount);

	if (!Number.isInteger(normalizedStampCount) || normalizedStampCount < 0) {
		throw createHttpError(
			400,
			"Stamp count must be a non-negative integer",
		);
	}

	const user = await loadRequiredUser(normalizedUserId);
	await userRepo.updateStampCount(normalizedUserId, normalizedStampCount);

	return toPublicUser({
		...user,
		stamp_count: normalizedStampCount,
	});
}

export async function incrementStampCount(userId, incrementBy = 1) {
	const normalizedUserId = normalizeUserId(userId);
	const normalizedIncrement = Number(incrementBy);

	if (!Number.isInteger(normalizedIncrement) || normalizedIncrement <= 0) {
		throw createHttpError(400, "Increment must be a positive integer");
	}

	const user = await loadRequiredUser(normalizedUserId);
	await userRepo.incrementStampCount(normalizedUserId, normalizedIncrement);

	return toPublicUser({
		...user,
		stamp_count: Number(user.stamp_count) + normalizedIncrement,
	});
}

export async function updateIsStampDiscountActive(userId, isActive) {
	const normalizedUserId = normalizeUserId(userId);

	if (typeof isActive !== "boolean") {
		throw createHttpError(400, "isActive must be boolean");
	}

	const user = await loadRequiredUser(normalizedUserId);
	await userRepo.updateIsStampDiscountActive(normalizedUserId, isActive);

	return toPublicUser({
		...user,
		is_stamp_discount_active: isActive,
	});
}
