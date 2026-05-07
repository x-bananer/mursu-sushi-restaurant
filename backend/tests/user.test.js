import argon2 from 'argon2';
import dotenv from 'dotenv';

dotenv.config({
	path: new URL('../.env', import.meta.url),
	override: true,
});

const { execute } = await import('../src/models/db/db.js');
const { pool } = await import('../src/models/db/connection.js');
const userRepo = await import('../src/models/db/repositories/user/user.repository.js');

const ARGON2_OPTIONS = {
	type: argon2.argon2id,
	memoryCost: 65536,
	timeCost: 3,
	parallelism: 1,
};

/* This test does the following :'):
1. creates a user with a hashed password
2. adds one stamp to them
3. removes one stamp
4. deletes the user
5. checks that this succeeded. Victory! */
async function run() {
	const testEmail = `etunimi.sukunimi@gmail.com`;
	const testPassword = 'Kissa123!';
	const testName = 'User / Stamp Test';
	let userId = 0;

	try {
		console.log('1) Creating user...');

		const passwordHash = await argon2.hash(testPassword, ARGON2_OPTIONS);
		userId = await userRepo.createUser({
			name: testName,
			email: testEmail,
			passwordHash,
		});

		if (!userId) {
			throw new Error('User was not created. ❌');
		}

		const createdUser = await userRepo.getUserById(userId);

		if (!createdUser) {
			throw new Error('Created user cannot be fetched. ❌');
		}

		console.log('User was created. ✅');

		const initialStampCount = Number(createdUser.stamp_count || 0);

		console.log('2) Adding one stamp...');
		await userRepo.incrementStampCount(userId, 1);

		const userAfterAdd = await userRepo.getUserById(userId);

		if (!userAfterAdd) {
			throw new Error('User cannot be fetched after add. ❌');
		}

		const expectedAfterAdd = initialStampCount + 1;

		if (Number(userAfterAdd.stamp_count) !== expectedAfterAdd) {
			throw new Error(
				`Stamp add failed. Expected ${expectedAfterAdd}, got ${userAfterAdd.stamp_count}. ❌`
			);
		}

		console.log('Stamp was added. ✅');

		console.log('3) Removing one stamp...');
		await userRepo.updateStampCount(userId, initialStampCount);

		const userAfterRemove = await userRepo.getUserById(userId);

		if (!userAfterRemove) {
			throw new Error('User cannot be fetched after remove. ❌');
		}

		if (Number(userAfterRemove.stamp_count) !== initialStampCount) {
			throw new Error(
				`Stamp remove failed. Expected ${initialStampCount}, got ${userAfterRemove.stamp_count}. ❌`
			);
		}

		console.log('Stamp was removed. ✅');

		console.log('4) Deleting user...');
		const deletedUserId = userId;

		await execute(
			`
        DELETE FROM users
        WHERE id = ?
      `,
			[userId]
		);

		userId = 0;

		const deletedUser = await userRepo.getUserById(deletedUserId);

		if (deletedUser) {
			throw new Error('User still exists after delete. ❌');
		}

		console.log('User was deleted. ✅');

		console.log('User create/add stamp/remove stamp/delete flow passed. ✅');
	} finally {
		if (userId) {
			await execute(
				`
          DELETE FROM users
          WHERE id = ?
        `,
				[userId]
			);
		}

		await pool.end();
	}
}

run().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
