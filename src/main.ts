import * as core from "@actions/core";
import * as tc   from "@actions/tool-cache";
import { getInputs, Inputs } from "./util/inputs";
import { findVersion, Version } from "./util/find-version";
import { filename, pathMinusFile } from "./util/path-utils";

async function run(): Promise<void> {
    try {
        const inputs: Inputs = getInputs();
        const version: Version = await findVersion(inputs.version, inputs.token);
        
        if(version.cached && inputs.cache) {
            const cache = tc.find(`melon-${version.type}`, version.name);
            tc.extractZip(cache, inputs.path);
        } else {
            const mlPath = await tc.downloadTool(version.source);
            const mlCachePath = await tc.cacheFile(pathMinusFile(mlPath), filename(mlPath), `melon-${version.type}`, version.name);
            core.addPath(mlCachePath);
            tc.extractZip(mlPath, inputs.path)
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();