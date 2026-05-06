import argon2 from "argon2";
import jwt from "jsonwebtoken";
import * as userRepo from "../../models/db/repositories/user/user.repository.js";
import { t } from "../../i18n/messages.js";

const ARGON2_OPTIONS = {
	type: argon2.argon2id,
	memoryCost: 65536,
	timeCost: 3,
	parallelism: 1,
};

function createHttpError(statusCode, message) {
    const error = /** @type {Error & { statusCode: number }} */ (new Error(message));
    error.statusCode = statusCode;
    return error;
}

function normalizeEmail(email) {
	if (typeof email !== "string") {
		return "";
	}

	return email.trim().toLowerCase();
}

function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function getJwtSecret(locale) {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw createHttpError(500, t(locale, "auth", "jwt_secret_not_configured"));
	}

	return secret;
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

function signToken(user, locale) {
	const secret = getJwtSecret(locale);
	
	const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

	return jwt.sign(
		{
			id: user.id,
			roleId: user.role_id,
		},
		secret,
		{ expiresIn },
	);
}

export async function register(payload, locale) {
	const name = typeof payload?.name === "string" ? payload.name.trim() : "";
	const email = normalizeEmail(payload?.email);
	const password =
		typeof payload?.password === "string" ? payload.password : "";

	let roleId = 1;
	if (Number(payload?.role_id) === 2) {
		if (payload?.adminSecret !== process.env.ADMIN_SECRET) {
			throw createHttpError(403, t(locale, "auth", "unauthorized_create_admin"));
		}
		roleId = 2;
	}

	if (!name) {
		throw createHttpError(400, t(locale, "auth", "name_required"));
	}

	if (!validateEmail(email)) {
		throw createHttpError(400, t(locale, "auth", "valid_email_required"));
	}

	if (password.length < 8) {
		throw createHttpError(400, t(locale, "auth", "password_min_8"));
	}

	const existingUser = await userRepo.getUserByEmail(email);

	if (existingUser) {
		throw createHttpError(409, t(locale, "auth", "user_exists"));
	}

	const passwordHash = await argon2.hash(password, ARGON2_OPTIONS);
	const userId = await userRepo.createUser({
		name,
		email,
		passwordHash,
		role_id: roleId,
	});

	if (!userId) {
		throw createHttpError(500, t(locale, "auth", "failed_create_user"));
	}

	const createdUser = await userRepo.getUserById(userId);

	if (!createdUser) {
		throw createHttpError(500, t(locale, "auth", "created_user_not_loaded"));
	}

	const token = signToken(createdUser, locale);

	return {
		user: toPublicUser(createdUser),
		token,
	};
}

export async function login(payload, locale) {
	const email = normalizeEmail(payload?.email);
	const password =
		typeof payload?.password === "string" ? payload.password : "";

	if (!validateEmail(email)) {
		throw createHttpError(400, t(locale, "auth", "valid_email_required"));
	}

	if (!password) {
		throw createHttpError(400, t(locale, "auth", "password_required"));
	}

	const user = await userRepo.getUserByEmail(email);

	if (!user) {
		throw createHttpError(401, t(locale, "auth", "invalid_email_or_password"));
	}

	let isPasswordValid = false;

	try {
		isPasswordValid = await argon2.verify(user.password_hash, password);
	} catch (error) {
		throw createHttpError(401, t(locale, "auth", "invalid_email_or_password"));
	}

	if (!isPasswordValid) {
		throw createHttpError(401, t(locale, "auth", "invalid_email_or_password"));
	}

	const token = signToken(user, locale);

	return {
		user: toPublicUser(user),
		token,
	};
}
