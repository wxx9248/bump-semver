#!/usr/bin/env node

import * as fs from "fs";
import * as process from "process";

import { ColoredLogger } from "./ColoredLogger.js";
import type { ReleaseType } from "semver";
import { SemVer } from "semver";
import * as path from "path";

const logger = new ColoredLogger();
const releaseTypes = ["major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease"];

function printUsage() {
    logger.info(
        `Usage: ${path.basename(process.argv[1])} [package.json] [${
            releaseTypes.reduce((previousValue, currentValue): string => {
                return previousValue + " | " + currentValue;
            })
        }]`
    );
}

function toReleaseType(s: string): ReleaseType | undefined {
    if (releaseTypes.includes(s)) {
        return s as ReleaseType;
    }
    return undefined;
}

async function main() {
    if (process.argv.length !== 4) {
        logger.error(`Invalid parameter count`);
        printUsage();
        process.exit(1);
    }

    const releaseTypeString = process.argv[3];
    const releaseType = toReleaseType(releaseTypeString);
    if (releaseType === undefined) {
        logger.error(`Invalid release type: ${releaseTypeString}`);
        printUsage();
        process.exit(1);
    }

    const packageJSONFilePath = process.argv[2];

    logger.info(`Using package.json file: ${packageJSONFilePath}`);
    logger.info(`Will bump semver by: ${releaseType}`);

    try {
        logger.debug("Reading package.json file");
        const buffer = await fs.promises.readFile(packageJSONFilePath);

        logger.debug("Parsing package.json file");
        const object = JSON.parse(buffer.toString());

        logger.debug("Parsing semver");
        const version = new SemVer(object["version"]);
        logger.info(`Parsed semver: ${version.version}`);

        version.inc(releaseType)
        logger.info(`Bumped semver: ${version.version}`);

        object["version"] = version.version

        logger.debug("Writing back to package.json");
        const jsonString = JSON.stringify(object, null, 2);
        await fs.promises.writeFile(packageJSONFilePath, jsonString);

        logger.success("Operation is successful");

    } catch (e) {
        logger.error(e);
        process.exit(-1);
    }
}

void main();
