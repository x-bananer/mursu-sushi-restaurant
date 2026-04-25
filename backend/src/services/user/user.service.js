import * as userRepo from "../../models/db/repositories/user/user.repository.js";

function createHttpError(statusCode, message) {
	const error = new Error(message);
	error.statusCode = statusCode;
	return error;
}

function normalizeUserId(userId) {
	const parsed = Number(userId);

	if (!Number.isInteger(parsed) || parsed <= 0) {
		throw createHttpError(400, "Valid user id is required");
	}

	return parsed;
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
	const user = await userRepo.getUserById(normalizedUserId);

	if (!user) {
		throw createHttpError(404, "User not found");
	}

	return user;
}

export async function assertUserExists(userId) {
	const normalizedUserId = normalizeUserId(userId);
	const exists = await userRepo.userExistsById(normalizedUserId);

	if (!exists) {
		throw createHttpError(404, "User not found");
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

	await requireUserById(normalizedUserId);
	await userRepo.updateStampCount(normalizedUserId, normalizedStampCount);

	return getUserById(normalizedUserId);
}

export async function incrementStampCount(userId, incrementBy = 1) {
	const normalizedUserId = normalizeUserId(userId);
	const normalizedIncrement = Number(incrementBy);

	if (!Number.isInteger(normalizedIncrement) || normalizedIncrement <= 0) {
		throw createHttpError(400, "Increment must be a positive integer");
	}

	await requireUserById(normalizedUserId);
	await userRepo.incrementStampCount(normalizedUserId, normalizedIncrement);

	return getUserById(normalizedUserId);
}

export async function updateIsStampDiscountActive(userId, isActive) {
	const normalizedUserId = normalizeUserId(userId);

	if (typeof isActive !== "boolean") {
		throw createHttpError(400, "isActive must be boolean");
	}

	await requireUserById(normalizedUserId);
	await userRepo.updateIsStampDiscountActive(normalizedUserId, isActive);

	return getUserById(normalizedUserId);
}
