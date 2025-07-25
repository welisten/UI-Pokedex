export default {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	testMatch: ["**/*.test.ts"],
	coveragePathIgnorePatterns: ["node_modules", "dist"],
    transform: {},
}