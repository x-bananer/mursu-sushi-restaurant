export default {
	testEnvironment: 'node',
	roots: ['<rootDir>/tests/integration'],
	testMatch: ['**/*.test.js'],
	setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.js'],
	transform: {},
};
