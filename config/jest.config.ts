import type {Config} from "@jest/types";

const config: Config.InitialOptionsWithRootDir = {
    moduleFileExtensions: ["ts", "js", "json"],
    preset: "ts-jest",
    rootDir: "../",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/config/tsconfig.jest.json",
        },
    },
    roots: ["<rootDir>"],
    testEnvironment: "node",
    testRegex: [String.raw`\.test\.tsx?$`],
    transform: {
        [String.raw`^.+\.tsx?$`]: "ts-jest",
    },
};

export default config;
