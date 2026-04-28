import argon2 from "argon2";
import jwt from "jsonwebtoken";
import * as userRepo from "../../models/db/repositories/user/user.repository.js";

const ARGON2_OPTIONS = {
	type: argon2.argon2id,
	memoryCost: 65536,
	timeCost: 3,
	parallelism: 1,
};

function createHttpError(statusCode, message) {
	const error = new Error(message);
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

function getJwtSecret() {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw createHttpError(500, "JWT secret is not configured");
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

function signToken(user) {
	const secret = getJwtSecret();
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

export async function register(payload) {
	const name = typeof payload?.name === "string" ? payload.name.trim() : "";
	const email = normalizeEmail(payload?.email);
	const password =
		typeof payload?.password === "string" ? payload.password : "";

	if (!name) {
		throw createHttpError(400, "Name is required");
	}

	if (!validateEmail(email)) {
		throw createHttpError(400, "Valid email is required");
	}

	if (password.length < 8) {
		throw createHttpError(400, "Password must be at least 8 characters");
	}

	const existingUser = await userRepo.getUserByEmail(email);

	if (existingUser) {
		throw createHttpError(409, "User with this email already exists");
	}

	const passwordHash = await argon2.hash(password, ARGON2_OPTIONS);
	const userId = await userRepo.createUser({
		name,
		email,
		passwordHash,
	});

	if (!userId) {
		throw createHttpError(500, "Failed to create user");
	}

	const createdUser = await userRepo.getUserById(userId);

	if (!createdUser) {
		throw createHttpError(500, "Created user cannot be loaded");
	}

	const token = signToken(createdUser);

	return {
		user: toPublicUser(createdUser),
		token,
	};
}

export async function login(payload) {
	const email = normalizeEmail(payload?.email);
	const password =
		typeof payload?.password === "string" ? payload.password : "";

	if (!validateEmail(email)) {
		throw createHttpError(400, "Valid email is required");
	}

	if (!password) {
		throw createHttpError(400, "Password is required");
	}

	const user = await userRepo.getUserByEmail(email);

	if (!user) {
		throw createHttpError(401, "Invalid email or password");
	}

	let isPasswordValid = false;

	try {
		isPasswordValid = await argon2.verify(user.password_hash, password);
	} catch (error) {
		throw createHttpError(401, "Invalid email or password");
	}

	if (!isPasswordValid) {
		throw createHttpError(401, "Invalid email or password");
	}

	const token = signToken(user);

	return {
		user: toPublicUser(user),
		token,
	};
}
