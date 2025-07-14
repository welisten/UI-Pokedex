export default {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/*.test.ts"],
	coveragePathIgnorePatterns: ["node_modules", "dist"],
    transform: {},
}