import * as core from "@actions/core";

export interface Inputs {
    version: string,
    path: string,
    cache: boolean
}

export function getInputs(): Inputs {
    return {
        version: core.getInput("version"),
        path: core.getInput("path"),
        cache: core.getBooleanInput("cache")
    }
}